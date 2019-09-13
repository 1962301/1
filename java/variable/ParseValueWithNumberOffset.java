package variable;

import java.util.ArrayList;

import Strategy.State;
import statementProperties.StatementProps;

public class ParseValueWithNumberOffset extends AbstractParseValueWithOffset{
	private String[] temp=new String[0];
	private int startIndex;
	private int endIndex;

	ParseValueWithNumberOffset(Parameters parameter) {
		super(parameter);
	}
	
	@Override
	public boolean valid(StatementProps stateProps) {
		this.setStartIndex(stateProps);
		this.setEndIndex(stateProps);
		if(parameter.getOffsetEnd()>0) return endIndex<=stateProps.getCurrentIndex();
		return true;
	}

	@Override
	public String[] getValues(StatementProps stateProps) {
		ArrayList<String> vList=new ArrayList<>();
		if(valid(stateProps)) {
			for(int i=startIndex;i<=endIndex;i++) vList.add(parameter.getMethod().get(stateProps.getOCHL(i), parameter.getSign()));
	
			if(vList.size()==0) return null;
			return vList.toArray(temp);
		}
		return null;
	}
	 

	@Override
	void setStartIndex(StatementProps stateProps) {
		this.startIndex=stateProps.getEnterOCHLIndex()+parameter.getOffsetStart()>0?stateProps.getEnterOCHLIndex()+parameter.getOffsetStart():0;
	}

	@Override
	void setEndIndex(StatementProps stateProps) {
		endIndex=stateProps.getEnterOCHLIndex()+parameter.getOffsetEnd();

		if(endIndex>stateProps.getCurrentIndex()) {
			endIndex=stateProps.getCurrentIndex();
			stateProps.setState(State.WAIT);
		}
		else if(endIndex<0){
			stateProps.setState(State.WAIT);
		}
	}

	
	
}
