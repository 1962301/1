package statementProperties;

import java.util.ArrayList;
import OCHL.OCHL;
import Strategy.Strategy;
import period.Period;
import record.RecordManager;

public class StatementPropsManager {
	//用于多线程时，这里要用带锁的queue
	//private ArrayList<StatementProps> statePropsList=new ArrayList<>();
	private StatePropsList<StatementProps> statePropsList;
	private boolean isStop=false;
	private RecordManager recordManager;
	
	public StatementPropsManager(String iniEntryStatementIndex,Period period,ArrayList<OCHL> dataList,RecordManager recordManager){
		this.recordManager=recordManager;
		this.statePropsList=new StatePropsList<>(dataList,iniEntryStatementIndex,period,recordManager);
	}

	
	public ArrayList<StatementProps> getStatePropsList() {
		return statePropsList;
	}
	
	public void run(Strategy strategy) {
		if(this.recordManager.isReachLimit()) statePropsList.setStopCreateNewStatementProps(true);
		statePropsList.prepare();
		for(StatementProps s:statePropsList) strategy.run(s);
	}
}
