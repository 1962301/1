package parseValue;

import OCHL.OCHL;

public class CloseValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		return sign>0?ochl.getClose():"-"+ochl.getClose();
	}

}
