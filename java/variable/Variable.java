package variable;

import Strategy.Strategy;
import statementProperties.StatementProps;

public class Variable {
	private String content;
	Parameters parameter;

	ParseValueWithOffset parseValueWithOffset;

	public Variable(String content,Strategy strategy) {
		this.content=content;
		ini(strategy);
	}

	
	public String getContent() {
		return this.content;
	}


	private void ini(Strategy strategy) {
		parameter=strategy.getParametersManager().getNewParametersInstance(content.substring(this.content.indexOf("(")+1, this.content.indexOf(")")).split(","), content.matches("^\\-")?-1:1);
		
		if(parameter.isTimeOffset()) parseValueWithOffset=new ParseValueWithTimeOffset(parameter);
		else parseValueWithOffset=new ParseValueWithNumberOffset(parameter);
	}
	
	public String[] parseValue(StatementProps stateProps) {
		return parseValueWithOffset.getValues(stateProps);
	}
	
	public String toString() {
		return content;
	}
	

	
}
