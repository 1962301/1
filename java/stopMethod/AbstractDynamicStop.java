package stopMethod;

import java.math.BigDecimal;

import action.ClosePositionParameter;

public abstract class AbstractDynamicStop implements StopMethod{
	BigDecimal basePrice;
	BigDecimal limitPrice;
	ClosePositionParameter stopPara;
	boolean isOpenPriceSet=false;
	
	AbstractDynamicStop(ClosePositionParameter stopPara){
		this.stopPara=stopPara;
	}
	
	public void setOpenPositionPrice(String openPrice) {
		this.basePrice=new BigDecimal(openPrice);
		this.limitPrice=new BigDecimal(this.stopPara.getOperator().cal(openPrice, this.stopPara.getOnTop()));
		isOpenPriceSet=true;
	}
	
	public String getLimitPrice() {
		if(limitPrice==null) return null;
		return limitPrice.toString();
	};
}
