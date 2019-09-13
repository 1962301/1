package variable;

import statementProperties.StatementProps;

public abstract class  AbstractParseValueWithOffset implements ParseValueWithOffset{
	Parameters parameter;
	
	public AbstractParseValueWithOffset(Parameters parameter) {
		this.parameter=parameter;
	}
	abstract void setStartIndex(StatementProps stateProps);
	abstract void setEndIndex(StatementProps stateProps);
}
