package condition;
import java.util.ArrayList;
import java.util.List;

import Strategy.Strategy;
import statementProperties.StatementProps;


public class Condition {
	private String content=null;
	private RPN rpn=null;

	
	public Condition(String content,Strategy strategy) {
		if(content!="null"&&content!=null&&!content.trim().equals("")) {
			this.content=content;
			this.rpn=new RPN(content,strategy);
		}
	}
	
	public String getContent() {
		return this.content;
	}
	public List<String> getRPNList(){
		if(rpn==null) return null;
		else return rpn.getRPNExpression();
	}
	
	public boolean getResult(StatementProps stateProps) {
		if(content!=null) return this.rpn.getResult(stateProps);
		else return true;
	}
	
	/**
	 * must be called after calling getResult();
	 * otherwise will get an empty list;
	 * and each calling of getResult() will result different detailsList;
	 * @return
	 */
	public ArrayList<String> getDetailsList(){
		if(rpn==null) return new ArrayList<>();
		return this.rpn.getDetailsList();
	}
	
	@Override
	public String toString() {
		if(rpn!=null) return rpn.getRPNExpression().toString();
		else return null;
	}
}
