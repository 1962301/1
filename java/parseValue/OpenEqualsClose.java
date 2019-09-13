package parseValue;

import java.math.BigDecimal;

import OCHL.OCHL;

public class OpenEqualsClose implements ParseValue{

	@Override
	public String get(OCHL ochl, int sign) {
		return String.valueOf(new BigDecimal(ochl.getOpen()).compareTo(new BigDecimal(ochl.getClose()))==0);
	}

}