package stopMethod;

import java.math.BigDecimal;
import action.ClosePositionParameter;


public abstract class AbstractFixedStop implements StopMethod{
	BigDecimal limitPrice;
	ClosePositionParameter stopPara;
	BigDecimal openPrice;
	boolean isOpenPriceSet=false;
	
	AbstractFixedStop(ClosePositionParameter stopPara){
		this.stopPara=stopPara;
	}
	
	public void setOpenPositionPrice(String openPrice) {
		this.openPrice=new BigDecimal(openPrice);
		limitPrice=new BigDecimal(stopPara.getOperator().cal(openPrice.toString(), stopPara.getOnTop()));
		isOpenPriceSet=true;
	}

	public void setLimitPrice(BigDecimal currentPrice) {}
	
	public String getLimitPrice() {
		if(limitPrice==null) return null;
		return limitPrice.toString();
	};
}
