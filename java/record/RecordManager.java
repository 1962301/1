package record;

import java.util.LinkedHashMap;

import statementProperties.SingleRecord;
import statementProperties.StatementProps;


public class RecordManager {
	private LinkedHashMap<Integer,Record> recordMap=new LinkedHashMap<>();
	private boolean recordCalDetails=true;
	private int recordLimit;
	private boolean isReachLimit=false;
	
	public RecordManager() {
	}
	
	public RecordManager(int recordLimit) {
		this.recordLimit=recordLimit;
	}
		
	
	public LinkedHashMap<Integer,Record> getRecordMap() {
		return recordMap;
	}
	
	public void printAllRecord() {
		for(Integer i:recordMap.keySet()) {
			System.out.println(i+":"+recordMap.get(i).getDetectedIndex());
			System.out.println(recordMap.get(i).getAllRecord());
		}
	}
	public void printAllAfterFirstLogicalTest() {
		for(Integer i:recordMap.keySet()) {
			if(recordMap.get(i).getAllRecord().size()>1) {
				System.out.println(i+":"+recordMap.get(i).getDetectedIndex());
				System.out.println(recordMap.get(i).getAllRecord());
			}
		}
	}
	
	public void setRecordLimit(int recordLimit) {
		this.recordLimit=recordLimit;
	}
	public boolean isReachLimit() {
		return this.isReachLimit;
	}

	public Record getRecord(int detectedIndex) {
		if(recordLimit!=0&&this.recordMap.size()>=recordLimit) isReachLimit=true;
		recordMap.putIfAbsent(detectedIndex, new Record(detectedIndex));
		return recordMap.get(detectedIndex);
	}
	
	public boolean isRecordCalDetails() {
		return recordCalDetails;
	}
}
