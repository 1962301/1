package operator;

import java.math.BigDecimal;

public class Divide implements Operator{
	@Override
	public String cal(String a, String b) {
		BigDecimal a1=new BigDecimal(a);
		BigDecimal b1=new BigDecimal(b);	
		return a1.divide(b1,6,BigDecimal.ROUND_HALF_UP).toString();
	}
}
