package variable;

import statementProperties.StatementProps;

public interface ParseValueWithOffset {
	public String[] getValues(StatementProps stateProps);
	public boolean valid(StatementProps stateProps);
}
