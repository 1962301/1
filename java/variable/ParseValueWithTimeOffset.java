package variable;
import java.time.LocalDateTime;
import java.util.ArrayList;

import Strategy.State;
import statementProperties.StatementProps;
import variable.AbstractParseValueWithOffset;

public class ParseValueWithTimeOffset extends AbstractParseValueWithOffset{
	private String[] temp=new String[0];
	private int startIndex;
	private int endIndex;

	public ParseValueWithTimeOffset(Parameters parameter) {
		super(parameter);
	}

	@Override
	public String[] getValues(StatementProps stateProps) {

		ArrayList<String> vList=new ArrayList<>();
		if(valid(stateProps)) {
			for(int i=startIndex;i<=endIndex;i++) {
				if(!LocalDateTime.parse(stateProps.getDataList().get(i).getDateTime()).plus(stateProps.getPeriod().getPeriodLength(),stateProps.getPeriod().getPeriodUnit()).isBefore(LocalDateTime.parse(stateProps.getEnterOCHL().getDateTime()).plus(parameter.getOffsetStart(),stateProps.getPeriod().getPeriodUnit()))&&
				   !LocalDateTime.parse(stateProps.getDataList().get(i).getDateTime()).isAfter(LocalDateTime.parse(stateProps.getEnterOCHL().getDateTime()).plus(parameter.getOffsetEnd(),stateProps.getPeriod().getPeriodUnit())))
				{
					vList.add(parameter.getMethod().get(stateProps.getOCHL(i),parameter.getSign()));
				}		
			}
			if(vList.size()==0) return null;
			else return vList.toArray(temp);
		}
		return null;
	}

	@Override
	public boolean valid(StatementProps stateProps) {
		setStartIndex(stateProps);
		setEndIndex(stateProps);
		if(parameter.getOffsetEnd()>0)	return stateProps.getCurrentOCHL().getLocalDateTime().isBefore(stateProps.getEnterOCHL().getLocalDateTime().plus(parameter.getOffsetEnd(),stateProps.getPeriod().getPeriodUnit()));
		return true;
	}

	@Override
	void setStartIndex(StatementProps stateProps) {
		this.startIndex=stateProps.getEnterOCHLIndex()+parameter.getOffsetStart()/stateProps.getPeriod().getPeriodLength();
		this.startIndex=startIndex>0?startIndex:0;
		
	}

	@Override
	void setEndIndex(StatementProps stateProps) {
		this.endIndex=stateProps.getEnterOCHLIndex()+parameter.getOffsetEnd()/stateProps.getPeriod().getPeriodLength();
		if(endIndex>stateProps.getCurrentIndex()) {
			endIndex=stateProps.getCurrentIndex();
			stateProps.setState(State.WAIT);
		}
		else if(endIndex<0) endIndex=0;
	}
	
}

