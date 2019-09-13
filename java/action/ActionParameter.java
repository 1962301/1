package action;

import stopMethod.StopMethod;

public class ActionParameter {
	private String content;	
	private OpenPositionParameter openPositionParameter;
	private ClosePositionParameter stopLossParameter;
	private ClosePositionParameter stopWinParameter;
	
	public ActionParameter(String content) {
		this.content=content;
		ini();
	}
	
	void ini() {
		String[] paraArr=content.split(";");
		openPositionParameter=new OpenPositionParameter(paraArr[0]);
		
		String[] stop=getParaArr(paraArr[1],"{","}",",");
		stopLossParameter=new ClosePositionParameter(getParaArr(stop[0],"(",")"," "),StopMethod.stopLoss,openPositionParameter);
		stopWinParameter=new ClosePositionParameter(getParaArr(stop[1],"(",")"," "),StopMethod.stopWin,openPositionParameter);
	}
	
	public String getContent() {
		return content;
	}
	
	private String[] getParaArr(String s, String startSymbol, String endSymbol, String splitSymbol) {
		return s.substring(s.indexOf(startSymbol)+1, s.indexOf(endSymbol)).split(splitSymbol);
	}
	
	OpenPositionParameter getOpenPositionParameter() {
		return openPositionParameter;
	}
	
	ClosePositionParameter getStopLossParameter() {
		return stopLossParameter;
	}
	
	ClosePositionParameter getStopWinParameter() {
		return stopWinParameter;
	}
}
