package operator;

public class Xor implements Operator{
	@Override
	public String cal(String a, String b) {
		Boolean a1=new Boolean(a);
		Boolean b1=new Boolean(b);
		return ((Boolean)(Boolean.logicalXor(a1, b1))).toString();
	}
}
