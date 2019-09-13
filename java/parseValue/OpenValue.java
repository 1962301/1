package parseValue;

import OCHL.OCHL;

public class OpenValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		return sign>0?ochl.getOpen():"-"+ochl.getOpen();
	}

}
