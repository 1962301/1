package operator;

import java.math.BigDecimal;

public class And implements Operator{
	@Override
	public String cal(String a, String b) {
		Boolean a1=new Boolean(a);
		Boolean b1=new Boolean(b);
		return ((Boolean)(Boolean.logicalAnd(a1, b1))).toString();
	}
}
