package stopMethod;

import java.math.BigDecimal;
import action.ClosePositionParameter;


public class DynamicBuyStopLoss extends AbstractDynamicBuyStop{
	
	public DynamicBuyStopLoss(ClosePositionParameter stopPara) {
		super(stopPara);
	}

	@Override
	public void setLimitPrice(BigDecimal currentPrice) {
		if(currentPrice.compareTo(basePrice)>0) {
			this.basePrice=currentPrice;
			this.limitPrice=new BigDecimal(this.stopPara.getOperator().cal(currentPrice.toString(), this.stopPara.getOnTop()));
		}
	}
	
}
