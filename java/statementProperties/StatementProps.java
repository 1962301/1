package statementProperties;

import java.util.ArrayList;
import OCHL.OCHL;
import Strategy.SingleStrategySentence;
import Strategy.State;
import period.Period;
import record.Record;
import record.RecordManager;
import variable.ParametersManager;

public class StatementProps {
	private RecordManager recordManager;
	//private EntryPoint entryPoint=new EntryPoint(recordManager);
	private ArrayList<OCHL> dataList;
	private int detectedOCHLIndex=-1;
	private int enterOCHLIndex=-1;
	private String nextStatementIndex;
	private State state=State.NEXT;
	private Period period;
	private boolean waitForNextCandle=false;
	public static int count=0;
	
	public StatementProps(ArrayList<OCHL> dataList,String iniEnterStateIndex, Period period, RecordManager recordManager) {
		this.dataList=dataList;
		this.nextStatementIndex=iniEnterStateIndex;
		this.period=period;
		this.recordManager=recordManager;
		//entryPoint.setDateList(dataList);
		count++;
	}
	
	/**
	 * entry is the index for next statement,
	 * resetEntreOCHLIndex, is the base index used to calculate next condition statement, if true, the entreOCHLIndex will be set to the current Index, otherwise it will keep the same. 
	 * @param entry
	 * @param resetEntreOCHLIndex
	 * @return
	 */
	public StatementProps setNextEntry(String entry,boolean resetEntreOCHLIndex) {
		//this.entryPoint.setNextEntry(entry);
		if(detectedOCHLIndex==-1) detectedOCHLIndex=dataList.size()-1;
		if(enterOCHLIndex==-1||resetEntreOCHLIndex)	enterOCHLIndex=dataList.size()-1;
		this.nextStatementIndex=entry;
		return this;
	}
	
	public void iniState() {
		state=State.NEXT;
	}

	/*
	public void assignLastEntry() {
		entryPoint.assignLastEntry();
	}
	*/
	
	public State setState(State state) {
		this.state=state;
		return this.state;
	}
	public void setDetectedOCHLIndex(int detectedOCHLIndex) {
		if(this.detectedOCHLIndex==-1) this.detectedOCHLIndex=detectedOCHLIndex;
	}
	
	public ArrayList<OCHL> getDataList() {
		return this.dataList;
	}

	public OCHL getEnterOCHL() {
		if(enterOCHLIndex==-1) enterOCHLIndex=dataList.size()-1;
		//return entryPoint.getEntryOCHL();
		return dataList.get(enterOCHLIndex);
	}
	public OCHL getDetectedOCHL() {
		return dataList.get(detectedOCHLIndex);
	}
	
	public int getEnterOCHLIndex() {
		if(enterOCHLIndex==-1) enterOCHLIndex=dataList.size()-1;
		//return entryPoint.getEntryOCHLIndex();
		return enterOCHLIndex;
	}
	public int getDetectedOCHLIndex() {
		return detectedOCHLIndex;
	}
	public OCHL getCurrentOCHL() {
		return this.dataList.get(dataList.size()-1);
	}
	public int getCurrentIndex() {
		return this.dataList.size()-1;
	}
	public OCHL getOCHL(int index) {
		return this.dataList.get(index);
	}
	public String getNextEntry() {
		//return entryPoint.getNextEntry();
		return nextStatementIndex;
	}
	public Period getPeriod() {
		return this.period;
	}
	public State getState() {
		return this.state;
	}
	public boolean isWaitForNextCandle() {
		return waitForNextCandle;
	}

	public Record getRecord() {
		return recordManager.getRecord(this.getDetectedOCHLIndex());
	}
	public RecordManager getRecordManager() {
		return this.recordManager;
	}

}
