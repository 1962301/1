package priceModel;

import java.math.BigDecimal;

public class CurrentPrice implements Price{
	public CurrentPrice() {}
	
	public boolean isCurrentPriceValid(BigDecimal currentPrice) {
		return true;
	}
	
}
