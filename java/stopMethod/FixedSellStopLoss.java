package stopMethod;

import java.math.BigDecimal;

import action.ActionException;
import action.ClosePositionParameter;


public class FixedSellStopLoss extends AbstractFixedStop{

	public FixedSellStopLoss(ClosePositionParameter stopPara) {
		super(stopPara);
	}

	@Override
	public boolean isStop(String currentPrice) {
		if(this.isOpenPriceSet) return new BigDecimal(currentPrice).compareTo(limitPrice)>=0;
		else throw new ActionException("FixedSellStopLoss class, openPrice has not been set");
	}

}
