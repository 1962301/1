package parseValue;

import java.math.BigDecimal;

import OCHL.OCHL;

public class BodyLowValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		BigDecimal o=new BigDecimal(ochl.getOpen());
		BigDecimal c=new BigDecimal(ochl.getClose());
		if(o.compareTo(c)==-1) return o.multiply(new BigDecimal(sign)).toString();
		else return c.toString();
	}
	
}

