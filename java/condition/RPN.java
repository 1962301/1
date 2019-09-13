package condition;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import Strategy.Strategy;
import operator.OperatorFactory;
import statementProperties.StatementProps;
import variable.Variable;

public class RPN {
	private ArrayList<String> replacedContentList;
	private ArrayList<Variable> varList=new ArrayList<>();
	private ArrayList<String> numList=new ArrayList<>();
	private ArrayList<String> RPNExpression=new ArrayList<>();
	
	private ArrayList<String> detailsList;

	public RPN(String content,Strategy strategy) {
		this.setParas(content,strategy);
		this.buildRPN();
	}
	
	private void setParas(String content,Strategy strategy) {
		replacedContentList=MatchValue.getExpression(content, varList, numList,strategy);
	}
	
	private void buildRPN(){
		ArrayDeque<String> deque=new ArrayDeque<>();
		for(String s:replacedContentList){
			if(s.equals(")")){
				while(!deque.peek().equals("("))	RPNExpression.add(deque.poll());
				deque.poll();
			}
			else if(OperatorFactory.contains(s)){
				while(!deque.isEmpty()&&
						(OperatorFactory.getOperatorPriority(s)<OperatorFactory.getOperatorPriority(deque.peek())||(OperatorFactory.getOperatorPriority(s)==4&&OperatorFactory.getOperatorPriority(deque.peek())==4))
						&&!s.equals("("))	RPNExpression.add(deque.pop());
				deque.push(s);
			}
			else RPNExpression.add(s);
		}		
		while(!deque.isEmpty()&&OperatorFactory.getOperatorPriority(deque.peek())!=0)	RPNExpression.add(deque.pop());
		
		if(!deque.isEmpty()) throw new ConditionException("Condition Class getRPN, the condition can't fully parse, condition="+replacedContentList);
	}
	
	public boolean getResult(StatementProps stateProps) {
		if(stateProps.getRecordManager().isRecordCalDetails()) detailsList=new ArrayList<>();
		
		ArrayDeque<String[]> t=new ArrayDeque<>();		
		int xCount=0;
		int yCount=0;

		try {
			for(String s:this.RPNExpression){
				if(OperatorFactory.contains(s)) {
					String[] r=cal(t.poll(),t.poll(),s);
					t.addFirst(r);
					
					if(stateProps.getRecordManager().isRecordCalDetails()) detailsList.add(s+"       ="+this.arrayToString(r));
				}
				
				else if(s.equals(MatchValue.varReplaceSymbol)) {
					String[] v=varList.get(xCount).parseValue(stateProps);
			
					if(stateProps.getRecordManager().isRecordCalDetails()) detailsList.add(varList.get(xCount).toString()+"    ="+this.arrayToString(v));

					if(v==null) return false;
					else t.addFirst(v);
					
					xCount++;
				}
				
				else if(s.equals(MatchValue.numReplaceSymbol)) {
					t.addFirst(new String[] {numList.get(yCount)});
					
					if(stateProps.getRecordManager().isRecordCalDetails()) detailsList.add(numList.get(yCount));
					
					yCount++;
				}
				
				else throw new ConditionException("Condition Class RPNresult, can't recognize String. input string="+s);
			}
		}catch(ArithmeticException err) {
			System.err.println(err.getMessage());
			return false;
		}
		
		String[] rArr=t.poll();
		
		for(String s:rArr) if(s.equals("true")) return true; 
		
		return false;
	}
	
	/**
	 * must be called after calling getResult();
	 * otherwise will get an empty list;
	 * and each calling of getResult() will result different detailsList;
	 * @return
	 */
	public ArrayList<String> getDetailsList(){
		if(this.detailsList==null) return new ArrayList<>(); 
		return detailsList;
	}
	
	private String[] cal(String[] o2,String[] o1,String operator){
		String[] rArr=new String[0];
		ArrayList<String> rList=new ArrayList<>();
		for(String s1:o1) {
			for(String s2:o2) {
				rList.add(OperatorFactory.getOperator(operator).cal(s1, s2));
			}
		}
		return rList.toArray(rArr);
	}
	
	private String arrayToString(String[] arr) {
		String temp="";
		if(arr!=null) for(String s:arr) temp+=s;
		else return "null";
		return temp;
	}
	public List<String> getRPNExpression(){
		return RPNExpression;
	}
	
}
