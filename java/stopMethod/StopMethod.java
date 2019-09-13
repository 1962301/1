package stopMethod;

import java.math.BigDecimal;

public interface StopMethod {
	public static final String dynamic="dynamic";
	public static final String fixed="fixed";
	public static final String stopWin="StopWin";
	public static final String stopLoss="StopLoss";
	public boolean isStop(String currentPrice);
	public void setLimitPrice(BigDecimal currentPrice);
	public void setOpenPositionPrice(String openPrice);
	public String getLimitPrice();
}
