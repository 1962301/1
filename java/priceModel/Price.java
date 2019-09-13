package priceModel;

import java.math.BigDecimal;

public interface Price {
	public boolean isCurrentPriceValid(BigDecimal currentPrice);
}
