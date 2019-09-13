package parseValue;

import OCHL.OCHL;

public class OpenBiggerThanClose implements ParseValue{

	@Override
	public String get(OCHL ochl, int sign) {
		return String.valueOf(Double.valueOf(ochl.getOpen())>Double.valueOf(ochl.getClose()));
	}

}