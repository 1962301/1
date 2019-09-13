package parseValue;

import java.math.BigDecimal;

import OCHL.OCHL;

public class HighLowMidValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		BigDecimal h=new BigDecimal(ochl.getHigh());
		BigDecimal l=new BigDecimal(ochl.getLow());
		if(sign==-1) return h.add(l).divide(new BigDecimal(2)).multiply(new BigDecimal(sign)).toString();
		return h.add(l).divide(new BigDecimal(2)).toString();
	}

}
