package operator;

import java.math.BigDecimal;

public class Multiply implements Operator{
	@Override
	public String cal(String a, String b) {
		BigDecimal a1=new BigDecimal(a);
		BigDecimal b1=new BigDecimal(b);	
		return a1.multiply(b1).toString();
	}
}
