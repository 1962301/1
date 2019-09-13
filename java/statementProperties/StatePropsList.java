package statementProperties;

import java.util.ArrayList;

import OCHL.OCHL;
import Strategy.State;
import period.Period;
import record.RecordManager;

public class StatePropsList<T> extends ArrayList<StatementProps>{
	private static final long serialVersionUID = 1L;
	
	private ArrayList<OCHL> dataList;
	private String iniEntryStatementIndex;
	private Period period;
	private RecordManager recordManager;
	private boolean stopCreateNewStatementProps=false;
	
	public StatePropsList(ArrayList<OCHL> dataList,String iniEntryStatementIndex,Period period,RecordManager recordManager) {
		super();
		this.dataList=dataList;
		this.iniEntryStatementIndex=iniEntryStatementIndex;
		this.period=period;
		this.recordManager=recordManager;
		this.add(new StatementProps(dataList,iniEntryStatementIndex,period,recordManager));
	}
	
	public void prepare() {
		this.removeIf(item-> item.getState()==State.END||item.getState()==State.ACTION);
		if(!stopCreateNewStatementProps) this.add(new StatementProps(dataList,iniEntryStatementIndex,period,recordManager));
	}
	
	public void setStopCreateNewStatementProps(boolean b) {
		this.stopCreateNewStatementProps=b;
	}
	
	public boolean isFinish() {
		if(!this.stopCreateNewStatementProps) return false;
		else {
			return dataList.size()==0;
		}
	}
}


