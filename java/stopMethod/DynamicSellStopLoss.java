package stopMethod;

import java.math.BigDecimal;
import action.ClosePositionParameter;


public class DynamicSellStopLoss extends AbstractDynamicSellStop{
	
	public DynamicSellStopLoss(ClosePositionParameter stopPara) {
		super(stopPara);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void setLimitPrice(BigDecimal currentPrice) {
		if(currentPrice.compareTo(basePrice)<0) {
			basePrice=currentPrice;
			this.limitPrice=new BigDecimal(stopPara.getOperator().cal(stopPara.getOnTop(), currentPrice.toString()));
		}
		
	}
	
}
