package parseValue;

import OCHL.OCHL;

public class VolumnValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		return sign>0?ochl.getVolume():"-"+ochl.getVolume();
	}

}
