package condition;

public class ConditionException extends RuntimeException{
	
	public ConditionException(String s) {
		super(s);
	}
	public ConditionException(String s, Throwable err) {
		super(s,err);
	}
}
