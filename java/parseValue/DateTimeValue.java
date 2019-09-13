package parseValue;

import OCHL.OCHL;

public class DateTimeValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		if(sign==-1) throw new ParseValueException("Error in DateTimeValue Class, datetime can't have a negative value. parameter sign="+sign);
		else return ochl.getDateTime();
	}

}
