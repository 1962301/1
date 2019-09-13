package parseValue;

import java.math.BigDecimal;
import OCHL.OCHL;

public class ColorValue implements ParseValue{

	@Override
	public String get(OCHL ochl,int sign) {
		BigDecimal o=new BigDecimal(ochl.getOpen());
		BigDecimal c=new BigDecimal(ochl.getClose());
		if(sign==-1) throw new ParseValueException("in ColorValue Class, color can't have a negative value: paramenter sign="+sign);
		else if(o.compareTo(c)==1) return "red";
		else return "green";
	}
	
}
