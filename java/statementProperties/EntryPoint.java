package statementProperties;

import java.util.ArrayList;

import OCHL.OCHL;
import Strategy.SingleStrategySentence;
import record.RecordManager;

public class EntryPoint {
	private String initialEntryStatementIndex=null;
	private String entryStatementIndex=null;
	
	//因为如果datalist的data不够，那么系统会不停的assign，造成entryOCHLIndex不刷新，锁死在0上
	//所以有了parameterManager算出至少需要多少OCHL，然后从最少OCHL index开始计算
	//所以entryOCHLIndex的初始值应该等于最少OCHL index，但是这个EntryPoint里没有ParamentManager，而且在创建EntryPoint的时候parameterManager还没有读文件
	//所以并不知道初始值应该是多少。所以将entryOCHLindx设为-1，第一次读取EntryStatementIndex的时候初始化这个数；
	private int entryOCHLIndex=-1;	//set this value when Strategy get EntryIndex at the first time;
	private boolean hasInitialEntryStatementIndexSet=false;
	private boolean hasEntryStatementIndexGet=false;
	private RecordManager recordManager;

	private ArrayList<OCHL> dataList;
	
	public EntryPoint(RecordManager recordManager){
		this.recordManager=recordManager;
	}
	
	public void setNextEntry(String entry) {	
		if(!hasInitialEntryStatementIndexSet) {
			initialEntryStatementIndex=entry;
			hasInitialEntryStatementIndexSet=true;
		}
		else entryOCHLIndex=dataList.size()-1;
		entryStatementIndex=entry;	
		hasEntryStatementIndexGet=false;
	}

	public void setDateList(ArrayList<OCHL> dataList) {
		this.dataList=dataList;
	}
	
	void assignLastEntry() {
		hasEntryStatementIndexGet=false;
	}
	
	public String getNextEntry() {	
		if(entryOCHLIndex==-1) {
			entryOCHLIndex=dataList.size()-1;
		}
		if(hasEntryStatementIndexGet) {
			entryStatementIndex=initialEntryStatementIndex;
			entryOCHLIndex=dataList.size()-1;		
			//hasEntryStatementIndexGet=false;
		}
		hasEntryStatementIndexGet=true;
		return entryStatementIndex;
	}
	public int getEntryOCHLIndex() {
		return this.entryOCHLIndex;
	}
	public OCHL getEntryOCHL() {
		return dataList.get(entryOCHLIndex);
	}
}
