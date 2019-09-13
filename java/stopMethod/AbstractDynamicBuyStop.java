package stopMethod;

import java.math.BigDecimal;

import action.ActionException;
import action.ClosePositionParameter;


public abstract class AbstractDynamicBuyStop extends AbstractDynamicStop{

	AbstractDynamicBuyStop(ClosePositionParameter stopPara) {
		super(stopPara);
	}
	
	/**
	 * for stop loss:
	 * the stop loss level will increase as current price excesses open position price 
	 * for stop win:
	 * when current price excesses open position price plus/multiply an initial value, 
	 * the stop win up bound price will keeping increase according to highest current price so as stop win low bound price until the current price drops below stop win low bound price return true.
	 */
	public boolean isStop(String currentPrice) {
		if(!this.isOpenPriceSet) throw new ActionException("AbstractDynamicSellStop, open price is not been set");
		BigDecimal cp=new BigDecimal(currentPrice);
		setLimitPrice(cp);
		return cp.compareTo(limitPrice)<=0;
	}
}
