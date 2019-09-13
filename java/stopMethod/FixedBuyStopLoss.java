package stopMethod;

import java.math.BigDecimal;

import action.ActionException;
import action.ClosePositionParameter;


public class FixedBuyStopLoss extends AbstractFixedStop{

	public FixedBuyStopLoss(ClosePositionParameter stopPara) {
		super(stopPara);
	}

	@Override
	public boolean isStop(String currentPrice) {
		if(this.isOpenPriceSet) return new BigDecimal(currentPrice).compareTo(limitPrice)<=0;
		else throw new ActionException("FixedBuyStopLoss class, openPrice has not been set");
	}



}
