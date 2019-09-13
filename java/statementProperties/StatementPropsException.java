package statementProperties;

public class StatementPropsException extends RuntimeException{
	public StatementPropsException(String s) {
		super(s);
	}
	public StatementPropsException(String s,Throwable err) {
		super(s,err);
	}
}
