package variable;

import parseValue.ParseValue;
import parseValue.ParseValueFactory;

public class Parameters {
	private final String methodName;
	private final ParseValue method;
	private final int offsetStart;
	private final int offsetEnd;
	private final String periodUnit;
	private final int sign;
	
	public Parameters(String[] arr, int sign) {
		methodName=arr[0];
		method=ParseValueFactory.getValue(arr[0]);
		offsetStart=Integer.parseInt(arr[1]);
		offsetEnd=Integer.parseInt(arr[2]);
		if(arr.length==4) periodUnit=arr[3];
		else periodUnit=null;
		this.sign=sign;
	}
	
	ParseValue 	getMethod()				{return method;}
	String		getMethodName()			{return methodName;}
	String		getPeriodUnit()			{return periodUnit;}
	int			getOffsetStart()		{return offsetStart;}
	int			getOffsetEnd()			{return offsetEnd;}
	int			getSign()				{return sign;}
	
	/**
	 * The offset define time range or number of candle range
	 * @return boolean
	 */
	boolean		isTimeOffset()			{return periodUnit==null?false:true;}
	
	@Override
	public String toString() {
		return methodName+","+offsetStart+","+offsetEnd+","+periodUnit;
	}
}
