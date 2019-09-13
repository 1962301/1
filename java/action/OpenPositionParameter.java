package action;

import java.math.BigDecimal;

import Strategy.State;
import operator.Operator;
import operator.OperatorFactory;

public class OpenPositionParameter {
	public static final String buy="buy";
	public static final String sell="sell";
	
	private String content;
	private String tradeType;
	private BigDecimal size;
	private Operator operator;
	private String onTop=null;
	private BigDecimal expectPrice=null; //is used to reach a preset price base on detected open price;
	
	OpenPositionParameter(String content){
		this.content=content;
		ini();
	}
	
	private void ini() {
		String[] paraArr=content.substring(content.indexOf("{")+1, content.indexOf("}")).split(",");
		if(paraArr.length<3) throw new ActionException("Action Parameter Class, ini(), parameter missing, oringinal content="+content);
		
		if(paraArr[0].equals(buy)) tradeType=buy;
		else if(paraArr[0].equals(sell)) tradeType=sell;
		else throw new ActionException("Action Parameter Class, ini(), parameter wrong, parameter should be buy or sell, input para="+paraArr[0]);
		
		try {
			size=(new BigDecimal(paraArr[1]));
			
			if(paraArr.length==2||paraArr[2].equals("0")||paraArr[2].toLowerCase().equals("current")) {}
			else if(paraArr[2].contains("%")) {
				operator=OperatorFactory.getOperator("*");
				onTop=new BigDecimal(paraArr[2].substring(0, paraArr[2].indexOf("%"))).divide(new BigDecimal(100)).add(new BigDecimal(1)).toString();
			}
			else {
				operator=OperatorFactory.getOperator("+");
				onTop=paraArr[2];
			}
		}catch(NumberFormatException e) {
			throw new ActionException("Action Parameter Class, ini(), can't parse size, oringinal content="+content,e);
		}
	}
	
	/**
	 * buy or sell
	 * @return
	 */
	public String getTradeType() {
		return tradeType;
	}
	
	/**
	 * trade size
	 * @return
	 */
	public BigDecimal getSize() {
		return size;
	}
	/**
	 * if trade price is current price then no needs for operator return null
	 * @return
	 */
	public Operator getOperator() {
		return operator;
	}
	/**
	 * return the expected open price, if the price is not set, return null;
	 * @return
	 */
	public String getExpectPrice() {
		if(expectPrice==null) return null;
		return expectPrice.toString();
	}
	
	public boolean isReachOpenPrice(String currentPrice) {
		if(operator==null) return true;
		else {
			if(expectPrice==null) expectPrice=new BigDecimal(operator.cal(currentPrice, onTop));
			if(tradeType.equals(buy)) return new BigDecimal(currentPrice).compareTo(expectPrice)>=0;
			else return new BigDecimal(currentPrice).compareTo(expectPrice)<=0;
		}
	}
}
   