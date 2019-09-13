package parseValue;

import java.math.BigDecimal;

import OCHL.OCHL;

public class OpenCloseMidValue implements ParseValue{
	@Override
	public String get(OCHL ochl,int sign) {
		BigDecimal o=new BigDecimal(ochl.getOpen());
		BigDecimal c=new BigDecimal(ochl.getClose());
		return o.add(c).divide(new BigDecimal(2)).multiply(new BigDecimal(sign)).toString();
	}

}
