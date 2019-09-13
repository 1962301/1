package condition;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import Strategy.Strategy;
import statementProperties.StatementProps;
import variable.Variable;

public class MatchValue {
	public static final String varReplaceSymbol="a";
	public static final String numReplaceSymbol="b";
	private static Pattern varPattern=Pattern.compile("^(\\-*v\\([^\\)]*\\))|[\\+\\-\\*/><=&\\|\\(](\\-*v\\([^\\)]*\\))");
	private static Pattern numPattern=Pattern.compile("^(\\-*\\d+\\.*\\d*E*\\-*\\d*\\.*\\d*)|[\\+\\-\\*/><=&\\|\\(](\\-*\\d+\\.*\\d*E*\\-*\\d*\\.*\\d*)");	
	private static Pattern exp=Pattern.compile(">=|<=|=>|=<|>|<|=|\\+|-|\\*|/|\\\\|\\(|\\)|&|\\||"+varReplaceSymbol+"|"+numReplaceSymbol);
	
	/*
	public static String getExpression(String content, ArrayList<Variable> varList,ArrayList<String> numList,StatementProps stateProps) {
		ArrayList<String> tempVarList=new ArrayList<>();
		String r1=replace(varPattern,content,varReplaceSymbol,tempVarList);
		
		for(String s:tempVarList) varList.add(new Variable(s,stateProps));
		return replace(numPattern,r1,numReplaceSymbol,numList).replaceAll("\\|+", "\\|").replaceAll("&+", "&").replaceAll("=+", "=");
	}
	*/
	private static String getReplace(String content, ArrayList<Variable> varList,ArrayList<String> numList,Strategy strategy) {
		ArrayList<String> tempVarList=new ArrayList<>();
		String r1=replace(varPattern,content,varReplaceSymbol,tempVarList);
		
		for(String s:tempVarList) varList.add(new Variable(s,strategy));
		
		return replace(numPattern,r1,numReplaceSymbol,numList).replaceAll("\\|+", "\\|").replaceAll("&+", "&").replaceAll("=+", "=");

	}
	
	private static String replace(Pattern pattern,String content,String replace,ArrayList<String> varList) {
		StringBuffer sb=new StringBuffer();
		Matcher m=pattern.matcher(content);
		
		int end=0;
		while(m.find()) {
			for(int i=1;i<=m.groupCount();i++) {
				if(m.group(i)!=null) {
					varList.add(m.group(i));
					m.appendReplacement(sb, m.group(0).replaceFirst(Pattern.quote(m.group(i)), replace));
				}
			}
			end=m.end();
		}		
		sb.append(content.substring(end));
			
		return sb.toString();
	}
	public static ArrayList<String> getExpression(String content, ArrayList<Variable> varList,ArrayList<String> numList,Strategy strategy){
		String replace=getReplace(content,varList,numList,strategy);
		Matcher m=exp.matcher(replace);
		ArrayList<String> tempList=new ArrayList<>();
		while(m.find()) {
			tempList.add(m.group(0));
		}
		return tempList;
	}
}
