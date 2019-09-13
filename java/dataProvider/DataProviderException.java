package dataProvider;

public class DataProviderException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public DataProviderException(String s) {
		super(s);
	}
	public DataProviderException(String s,Throwable err) {
		super(s,err);
	}
}
