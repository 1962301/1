package priceModel;

import java.math.BigDecimal;

public class OnTopByNumber implements Price{
	private final String tradeDirection;
	private final BigDecimal onTopPrice;
	private BigDecimal tradePrice;
	
	public OnTopByNumber(String tradeDirection,String onTop) {
		this.tradeDirection=tradeDirection;
		this.onTopPrice=new BigDecimal(onTop);
	}
	
	public void setBasePrice(BigDecimal currentPrice) {
		tradePrice=onTopPrice.add(currentPrice);
	}

	@Override
	public boolean isCurrentPriceValid(BigDecimal currentPrice) {
		if(tradeDirection.equals("sell")) return currentPrice.compareTo(tradePrice)<=0;
		else return currentPrice.compareTo(tradePrice)>=0;
	}
	
}
