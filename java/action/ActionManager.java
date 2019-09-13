package action;

import java.util.ArrayList;

public class ActionManager {
	private ArrayList<Action> actionList=new ArrayList<>();
	private ArrayList<String> profitList=new ArrayList<>();
	
	public void add(Action action) {
		actionList.add(action);
	}
	public ArrayList<Action> getActionList(){
		return actionList;
	}
	public ArrayList<String> getProfitList(){
		return profitList;
	}
	
	
	public void run(String currentPrice, int currentOCHLIndex) {
		actionList.removeIf(action->{
			action.run(currentPrice, currentOCHLIndex);
			if(action.isClosed()) profitList.add(action.getProfit());
			return action.isClosed();
		});
	}
}
