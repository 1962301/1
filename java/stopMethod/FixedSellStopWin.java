package stopMethod;

import java.math.BigDecimal;

import action.ActionException;
import action.ClosePositionParameter;


public class FixedSellStopWin extends AbstractFixedStop{

	public FixedSellStopWin(ClosePositionParameter stopPara) {
		super(stopPara);
		// TODO Auto-generated constructor stub
	}

	@Override
	public boolean isStop(String currentPrice) {
		if(this.isOpenPriceSet) return new BigDecimal(currentPrice).compareTo(limitPrice)<=0;
		else throw new ActionException("FixedSellStopWin class, openPrice has not been set");
	}

}
