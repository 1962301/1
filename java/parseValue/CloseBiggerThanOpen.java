package parseValue;

import OCHL.OCHL;

public class CloseBiggerThanOpen implements ParseValue{

	@Override
	public String get(OCHL ochl, int sign) {
		return String.valueOf(Double.valueOf(ochl.getClose())>Double.valueOf(ochl.getOpen()));
	}

}
