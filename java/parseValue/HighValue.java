package parseValue;

import OCHL.OCHL;

public class HighValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		return sign>0?ochl.getHigh():"-"+ochl.getHigh();
	}

}
