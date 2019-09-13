package stopMethod;

import java.math.BigDecimal;

import action.ActionException;
import action.ClosePositionParameter;

public abstract class AbstractDynamicSellStop extends AbstractDynamicStop{
	AbstractDynamicSellStop(ClosePositionParameter stopPara) {
		super(stopPara);
	}
	
	/**
	 * For stop loss:
	 * the stop loss price will decrease according to lowest current price
	 * For stop win:
	 * the low bound and high bound of stop price will decrease when current price drops, until the current price increase higher than high bound of stop price, return true.
	 */
	public boolean isStop(String currentPrice) {
		if(!this.isOpenPriceSet) throw new ActionException("AbstractDynamicSellStop, open price is not been set");
		BigDecimal cp=new BigDecimal(currentPrice);
		setLimitPrice(cp);
		return cp.compareTo(limitPrice)>=0;
	}
}
