package operator;

public class Or implements Operator{
	@Override
	public String cal(String a, String b) {
		Boolean a1=new Boolean(a);
		Boolean b1=new Boolean(b);
		return ((Boolean)(Boolean.logicalOr(a1, b1))).toString();
	}
}
