package Strategy;

import java.util.ArrayList;
import java.util.HashMap;

import OCHL.OCHL;
import period.Period;
import statementProperties.StatementProps;
import variable.ParametersManager;

public class Strategy {
	private HashMap<String,SingleStrategySentence> strategyMap=new HashMap<>();
	private boolean finish=false;
	private ParametersManager paraManager=new ParametersManager();
	private String iniEntryStatementIndex;
	private Period period;
	private boolean waitForNextCandle;
	
	Strategy(String iniEntryStatementIndex,Period period,boolean waitForNextCandle){
		this.iniEntryStatementIndex=iniEntryStatementIndex;
		this.period=period;
		this.waitForNextCandle=waitForNextCandle;
	}
	
	public void add(String index,SingleStrategySentence sss) {
		strategyMap.put(index,sss);
	}
	public void setFinish(boolean finish) {
		this.finish=finish;
	}
	public void setPeriod(int periodLength, String unit) {
		this.period=new Period(periodLength,unit);
	}

	public void run(StatementProps statementProps) {
		if(!finish) {
			State state=State.NEXT;
			while(state==State.NEXT) {
				statementProps.iniState();
				String next=statementProps.getNextEntry();
				state=strategyMap.get(next).run(statementProps);
			}
		}
	}
	
	public ParametersManager getParametersManager() {
		return this.paraManager;
	}
	
	public String getIniEntryStatementIndex() {
		return iniEntryStatementIndex;
	}
	public Period getPeriod() {
		return period;
	}
	/**
	 * when finish a set of if-else condition calculation, whether needs to wait for next available candle to enter sub if-else or action set
	 * @return
	 */
	public boolean isWaitForNextCandle() {
		return waitForNextCandle;
	}
}
