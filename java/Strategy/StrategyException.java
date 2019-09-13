package Strategy;

public class StrategyException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	StrategyException(String s){
		super(s);
	}
	StrategyException(String s,Throwable err){
		super(s,err);
	}
}
