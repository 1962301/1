package stopMethod;

import java.math.BigDecimal;
import action.ClosePositionParameter;


public class DynamicSellStopWin extends AbstractDynamicSellStop{
	private BigDecimal initialWinLimit;
	
	public DynamicSellStopWin(ClosePositionParameter stopPara) {
		super(stopPara);
	}

	@Override
	public void setLimitPrice(BigDecimal currentPrice) {
		if(initialWinLimit==null) {
			initialWinLimit=new BigDecimal(this.stopPara.getOperator().cal(basePrice.toString(),this.stopPara.getInitialOnTop()));
			this.limitPrice=initialWinLimit;
		}
		
		if(currentPrice.compareTo(basePrice)<0) {
			this.basePrice=currentPrice;
			if(currentPrice.compareTo(initialWinLimit)<0) this.limitPrice=new BigDecimal(this.stopPara.getOperator().cal(currentPrice.toString(), this.stopPara.getOnTop()));
		}
		
	}

}
