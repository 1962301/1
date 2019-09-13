package action;

import java.math.BigDecimal;

import operator.Operator;
import operator.OperatorFactory;
import stopMethod.DynamicBuyStopLoss;
import stopMethod.DynamicBuyStopWin;
import stopMethod.DynamicSellStopLoss;
import stopMethod.DynamicSellStopWin;
import stopMethod.FixedBuyStopLoss;
import stopMethod.FixedBuyStopWin;
import stopMethod.FixedSellStopLoss;
import stopMethod.FixedSellStopWin;
import stopMethod.StopMethod;

public class ClosePositionParameter {
	Operator operator;
	String onTop;
	String initialOnTop;
	StopMethod stopMethod;
	String tradeType;
	BigDecimal size;
	
	ClosePositionParameter(String[] paraArr,String type,OpenPositionParameter openPositionParameter){
		String sign="";
		if(type.equals(StopMethod.stopLoss)) {
			if(paraArr[0].equals(StopMethod.fixed)) {
				if(openPositionParameter.getTradeType().equals(OpenPositionParameter.buy)) 			stopMethod=new FixedBuyStopLoss(this);
				else if (openPositionParameter.getTradeType().equals(OpenPositionParameter.sell)) 	stopMethod=new FixedSellStopLoss(this);
			}
			else if(paraArr[0].equals(StopMethod.dynamic)) {
				if(openPositionParameter.getTradeType().equals(OpenPositionParameter.buy)) 			stopMethod=new DynamicBuyStopLoss(this);
				else if (openPositionParameter.getTradeType().equals(OpenPositionParameter.sell)) 	stopMethod=new DynamicSellStopLoss(this);
			}
			
			if(openPositionParameter.getTradeType().equals(OpenPositionParameter.buy)) sign="-";
		}
		else if(type.equals(StopMethod.stopWin)) {
			if(paraArr[0].equals(StopMethod.fixed)) {
				if(openPositionParameter.getTradeType().equals(OpenPositionParameter.buy)) 			stopMethod=new FixedBuyStopWin(this);
				else if (openPositionParameter.getTradeType().equals(OpenPositionParameter.sell)) 	stopMethod=new FixedSellStopWin(this);
			}
			else if(paraArr[0].equals(StopMethod.dynamic)) {
				if(openPositionParameter.getTradeType().equals(OpenPositionParameter.buy)) 			stopMethod=new DynamicBuyStopWin(this);
				else if (openPositionParameter.getTradeType().equals(OpenPositionParameter.sell)) 	stopMethod=new DynamicSellStopWin(this);
			}
			
			if(openPositionParameter.getTradeType().equals(OpenPositionParameter.sell))	sign="-";
			
		}
		else throw new ActionException("StopParameter class, can resolt type, type="+type);
		
		if(paraArr[1].contains("%")) {
			operator=OperatorFactory.getOperator("*");			
			BigDecimal temp=new BigDecimal(paraArr[1].substring(0,paraArr[1].indexOf("%"))).divide(new BigDecimal(100)).abs();			
			onTop=sign.equals("-")?new BigDecimal(1).subtract(temp).toString():new BigDecimal(1).add(temp).toString();
		}
		else {
			operator=OperatorFactory.getOperator("+");
			onTop=sign+new BigDecimal(paraArr[1]).abs().toString();
		}
		
		if(openPositionParameter.getTradeType().equals(OpenPositionParameter.buy)) tradeType=OpenPositionParameter.sell;
		else tradeType=OpenPositionParameter.buy;
		
		size=openPositionParameter.getSize();
	}
	
	public Operator getOperator() {
		return operator;
	}
	/**
	 * return the add on/multiply value
	 * @return
	 */
	public String getOnTop() {
		return onTop;
	}
	
	public String getInitialOnTop() {
		return initialOnTop;
	}
	public String getTradeType() {
		return tradeType;
	}
	public BigDecimal getSize() {
		return size;
	}
	public void setOpenPrice(String openPrice) {
		this.stopMethod.setOpenPositionPrice(openPrice);
	}
	public boolean isReachClosePrice(String currentPrice) {
		return this.stopMethod.isStop(currentPrice);
	}
	
	public String getLimitPrice() {
		return this.stopMethod.getLimitPrice();
	}
	
}
