package operator;

public class OperatorException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public OperatorException(String s){
		super(s);
	}
	public OperatorException(String s,Throwable err){
		super(s,err);
	}
}