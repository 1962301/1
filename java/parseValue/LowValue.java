package parseValue;

import OCHL.OCHL;

public class LowValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		return sign>0?ochl.getLow():"-"+ochl.getLow();
	}

}
