package operator;

import java.math.BigDecimal;

public class Minus implements Operator{

	@Override
	public String cal(String a, String b) {
		BigDecimal a1=new BigDecimal(a);
		BigDecimal b1=new BigDecimal(b);	
		return a1.subtract(b1).toString();
	}

}
