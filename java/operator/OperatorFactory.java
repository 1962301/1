package operator;

import java.util.HashMap;


public class OperatorFactory {
	private static final HashMap<String,Operator> opMap=new HashMap<>();
	static {	
		opMap.put("+", new Add());
		opMap.put("-", new Minus());
		opMap.put("*", new Multiply());
		opMap.put("x", new Multiply());
		opMap.put("/", new Divide());
		opMap.put(">", new BiggerThan());
		opMap.put("<", new SmallerThan());
		opMap.put("=", new Equal());
		opMap.put("==", new Equal());
		opMap.put(">=", new EqualBigger());
		opMap.put("=>", new EqualBigger());
		opMap.put("<=", new EqualSmaller());
		opMap.put("=<", new EqualSmaller());
		opMap.put("|",  new Or());
		opMap.put("||", new Or());
		opMap.put("&", new And());
		opMap.put("&&", new And());
	}
	
	public static final HashMap<String,Integer> operatorPriorityMap=new HashMap<>();
	static{
		operatorPriorityMap.put("(",	0);
		operatorPriorityMap.put(")",	0);
		operatorPriorityMap.put("|",	1);
		operatorPriorityMap.put("&",	1);
		operatorPriorityMap.put(">=",	2);
		operatorPriorityMap.put(">",	2);
		operatorPriorityMap.put("<=",	2);
		operatorPriorityMap.put("<",	2);
		operatorPriorityMap.put("=",	2);
		operatorPriorityMap.put("+",	3);
		operatorPriorityMap.put("-",	3);
		operatorPriorityMap.put("*",	4);
		operatorPriorityMap.put("/",	4);
	}
	
	public static Operator getOperator(String op){
		return opMap.get(op);
	}
	public static Integer getOperatorPriority(String op) {
		return operatorPriorityMap.get(op);
	}
	public static boolean contains(String s) {
		return operatorPriorityMap.containsKey(s);
	}
}
