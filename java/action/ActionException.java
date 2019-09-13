package action;

public class ActionException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public ActionException(String s){
		super(s);
	}
	public ActionException(String s, Throwable err){
		super(s,err);
	}
}
