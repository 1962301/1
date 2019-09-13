package analyse;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Set;
import java.util.TreeSet;

import com.amazonaws.services.s3.AmazonS3;

import OCHL.OCHL;
import Strategy.SingleStrategySentence;
import Strategy.Strategy;
import Strategy.StrategyBuilder;
import action.ActionManager;
import dataProvider.DataProvider;
import localDB.LocalDB;
import record.Record;
import record.RecordManager;
import statementProperties.SingleRecord;
import statementProperties.StatementProps;
import statementProperties.StatementPropsManager;

public class Analyse {
	private DataProvider dp;
	private Strategy strategy;
	private StatementPropsManager statePropsManager;
	private ArrayDeque<OCHL> ad;
	private ArrayList<OCHL> dataList=new ArrayList<>();
	private ActionManager actionManager=new ActionManager();
	private RecordManager recordManager=new RecordManager(); 

	
	public Analyse(){}
	
	public Analyse(ArrayDeque<OCHL> ad,String stategyFilePath,String bucket,AmazonS3 s3client,int recordLimit,int periodLength, String unit) {
		this.ad=ad;
		this.recordManager.setRecordLimit(recordLimit);
		this.setStategyFilePath(stategyFilePath,bucket,s3client);
		this.setPeriod(periodLength, unit);
	}
	
	//this is for local file system
	public Analyse(ArrayDeque<OCHL> ad,int recordLimit, String stategyFilePath,int periodLength, String unit) {
		this.ad=ad;
		this.recordManager.setRecordLimit(recordLimit);
		this.setStategyFilePath(stategyFilePath);
		this.setPeriod(periodLength, unit);
	}
	
	public Analyse(String strategyFilePath,String dateFilePath){
		this();
		setStategyFilePath(strategyFilePath);
		setDateFilePath(dateFilePath);
	}
	public Analyse setStategyFilePath(String path) {
		strategy=StrategyBuilder.build(path,actionManager);
		return this;
	}
	public Analyse setStategyFilePath(String path,String bucket,AmazonS3 s3client) {
		strategy=StrategyBuilder.build(path,bucket,actionManager,s3client);
		return this;
	}
	public Analyse setDateFilePath(String path) {
		dp=new DataProvider(path).readFile();
		return this;
	}
	public Analyse setPeriod(int periodLength, String unit) {
		this.strategy.setPeriod(periodLength, unit);
		return this;
	}
	public Analyse setRecordLimit(int recordLimit) {
		this.recordManager.setRecordLimit(recordLimit);
		return this;
	}
	
	private void prepare() {
		if(ad==null) {
			if(dp==null) throw new RuntimeException("Analyse Class, prepare method, please set either data deque or data file path");
			else ad=dp.getDataQueue();
		}
		statePropsManager=new StatementPropsManager(strategy.getIniEntryStatementIndex(),strategy.getPeriod(),dataList,recordManager);      
	}
	
	public void run() {
		prepare();
		
		int bound=ad.size();

		long time1=System.nanoTime();	
		for(int i=0;i<bound;i++) {
			OCHL currentOCHL=ad.poll();
			dataList.add(currentOCHL);
			if(i>(strategy.getParametersManager().getOffsetStartLowerBound()*-1)) {
				statePropsManager.run(strategy);
				actionManager.run(currentOCHL.getClose(), i);		
			}
			//System.out.println(i+" out of "+bound);
			
		}
		long time2=System.nanoTime();
		System.out.println("calculation time="+(time2-time1));

		String filePath="C:\\1\\";
		
		int countDetect=0;
		int countSuccess=0;
		

		LinkedHashMap<Integer, Record> recordMap=recordManager.getRecordMap();
		for(int index:recordMap.keySet()) {
			Record record=recordMap.get(index);
			if(record.getAllRecord().size()>1) {
				countDetect++;
				if(record.isClosed()) countSuccess++;
				try(FileWriter fw=new FileWriter(filePath+record.getDetectedIndex()+"_"+record.isClosed()+".txt");BufferedWriter bw=new BufferedWriter(fw)){
					for(SingleRecord singleRecord:record.getAllRecord()) {
						bw.write(singleRecord.getCurrentOCHLIndex()+"   "+singleRecord.getResult());
						bw.newLine();
						bw.write(singleRecord.getContent());
						bw.newLine();
						if(recordManager.isRecordCalDetails()) {
							for(String detail:singleRecord.getDetailsList()) {
								bw.write(detail);
								bw.newLine();
							}
						}
					}
					bw.flush();
				}catch(Exception e) {
					e.printStackTrace();
				}
			}
		}

		BigDecimal totalProfit=new BigDecimal(0);
		for(String s:actionManager.getProfitList()) {
			totalProfit=totalProfit.add(new BigDecimal(s));
		}
	}
	
	public LinkedHashMap<Integer,Record> getRecordMap(){
		return this.recordManager.getRecordMap();
	}
	
	public ArrayList<OCHL> getDataList(){
		return this.dataList;
	}
}
