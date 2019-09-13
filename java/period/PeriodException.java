package period;

public class PeriodException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public PeriodException(String s){
		super(s);
	}
	public PeriodException(String s,Throwable err){
		super(s,err);
	}
}
