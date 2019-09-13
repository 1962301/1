package Strategy;

import java.util.ArrayList;

import action.Action;
import action.ActionManager;
import condition.Condition;
import statementProperties.SingleRecord;
import statementProperties.StatementProps;

public class SingleStrategySentence {
	private Condition condition;
	private String actionContent;
	private String truthEntry;
	private String falseEntry;
	private String index=null;	//used to recored the entry point of this strategy sentence, not force to set
	private ActionManager actionManager;
	public static int count=0;
	
	public SingleStrategySentence() {
	}
	public SingleStrategySentence(Condition condition,String actionContent,String truthEntry,
			String falseEntry, ActionManager actionManager) {
		this.condition=condition;
		this.actionContent=actionContent;
		this.truthEntry=truthEntry;
		this.falseEntry=falseEntry;
		this.actionManager=actionManager;
	}
	public SingleStrategySentence setCondition(Condition condition) {
		this.condition=condition;
		return this;
	}
	public SingleStrategySentence setActionContent(String actionContent) {
		this.actionContent=actionContent;
		return this;
	}
	public SingleStrategySentence setTruthEntry(String entry) {
		this.truthEntry=entry;
		return this;
	}
	public SingleStrategySentence setFalseEntry(String entry) {
		this.falseEntry=entry;
		return this;
	}

	public SingleStrategySentence setIndex(String index) {
		this.index=index;
		return this;
	}
	
	public Condition getCondition() {
		return this.condition;
	}
	public String getActionContent() {
		return this.actionContent;
	}
	public String getTruthEntry() {
		return this.truthEntry;
	}
	public String getFalseEntry() {
		return this.falseEntry;
	}
	public String getIndex() {
		return this.index;
	}
	
	/**
	 * 
	 * @return
	 * return truthEntry point if condition is true and no action followed
	 * return falseEntry point if condition is false and has falseEntry
	 * return null if action is taken or no false entry;
	 * 
	 */
	public State run(StatementProps stateProps) {
		if(condition.getResult(stateProps)) {
			stateProps.setDetectedOCHLIndex(stateProps.getCurrentIndex());
			addToRecord(this.toString(),true,stateProps.getCurrentIndex(),condition.getDetailsList(),stateProps);

			if(truthEntry.toLowerCase().equals("action")) {
				count++;
				actionManager.add(new Action(actionContent,stateProps.getRecord()));
				return stateProps.setState(State.ACTION);
				
			}
			else if(truthEntry.matches("\\d+")){
				stateProps.setNextEntry(truthEntry,false);
				return stateProps.setState(stateProps.isWaitForNextCandle()?State.WAIT:State.NEXT);
			}
			else {
				throw new StrategyException("SingleStrategySentence Class, run method, truthEntry can't be resolve, truthEntry="+truthEntry);
			}
		}
		else {

			if(stateProps.getState()==State.WAIT) {
				addToRecord(this.toString(),false,stateProps.getCurrentIndex(),condition.getDetailsList(),stateProps);	
				return stateProps.setState(State.WAIT);
			}
			
			if(stateProps.getDetectedOCHLIndex()>0) addToRecord(this.toString(),false,stateProps.getCurrentIndex(),condition.getDetailsList(),stateProps);
			if(falseEntry.matches("\\d+")) {				
				stateProps.setNextEntry(falseEntry,false);
				return stateProps.setState(State.NEXT);
			}
			else	return stateProps.setState(State.END);
			
		}
	}
	public void addToRecord(String content,boolean result,int currentOCHLIndex,ArrayList<String> detailsList,StatementProps stateProps) {
		SingleRecord singleRecord=new SingleRecord(SingleRecord.condition);
		singleRecord.setResult(result).setCurrentOCHLIndex(currentOCHLIndex).setContent(content);
		if(stateProps.getRecordManager().isRecordCalDetails()) singleRecord.setDetailsList(detailsList);
		stateProps.getRecord().add(singleRecord);
	}
	
	
	
	@Override
	public String toString() {
		return "index="+index+",condition="+condition.getContent()+"---Action="+actionContent+"---t="+truthEntry+"---f="+falseEntry;
	}

}
