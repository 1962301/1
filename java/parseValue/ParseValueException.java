package parseValue;

public class ParseValueException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public ParseValueException(String s){
		super(s);
	}
	public ParseValueException(String s,Throwable err){
		super(s,err);
	}
}