package action;

import java.math.BigDecimal;
import java.util.ArrayList;

import record.Record;
import statementProperties.SingleRecord;

public class Action {
	private String content;
	private boolean isOpenPosition=false;
	private boolean isClosed=false;
	private ActionParameter actionPara;
	private String openPrice;
	private String closePrice;
	private String profit;
	private Record record;
	
	public Action(String content,Record record) {
		this.content=content;
		actionPara=new ActionParameter(content);
		this.record=record;
	}
	
	public void run(String currentPrice,int index) {
		if(!isOpenPosition) {	
			SingleRecord singleRecord=getSingleRecord(SingleRecord.open,index);
			ArrayList<String> detailList=singleRecord.getDetailsList();
			
			if(actionPara.getOpenPositionParameter().isReachOpenPrice(currentPrice)) {
				String tradeType=actionPara.getOpenPositionParameter().getTradeType();
				singleRecord.setResult(true);
				record.setOpened(true,currentPrice,tradeType);
				openPosition(currentPrice,actionPara.getOpenPositionParameter().getSize(),tradeType);	
			}
			detailList.add("try to open, result:"+isOpenPosition);
			detailList.add("trade type="+actionPara.getOpenPositionParameter().getTradeType()+"   "+"trade size="+actionPara.getOpenPositionParameter().getSize());
			detailList.add("currentPrice="+currentPrice);
			detailList.add("expected price is "+actionPara.getOpenPositionParameter().getExpectPrice()+", open price is "+openPrice);
		}
		else if(!isClosed){
			SingleRecord singleRecord=getSingleRecord(SingleRecord.close,index);
			ArrayList<String> detailList=singleRecord.getDetailsList();
			
			if(actionPara.getStopLossParameter().isReachClosePrice(currentPrice)||actionPara.getStopWinParameter().isReachClosePrice(currentPrice)) {
				singleRecord.setResult(true);
				record.setClosed(true,currentPrice);
				closePosition(currentPrice, actionPara.getStopLossParameter().getSize(), actionPara.getStopLossParameter().tradeType);
				//actionPara.getStopLossParameter().getSize() or actionPara.getStopWinParameter().getSize() are the same, so use either are fine;
				//same as for tradeType;
			}
			detailList.add("try to close");
			detailList.add("result: "+isClosed);
			detailList.add("trade size="+actionPara.getStopLossParameter().getSize());
			detailList.add("trade type="+actionPara.getStopLossParameter().getTradeType());
			detailList.add("currentPrice="+currentPrice);
			detailList.add("StopLoss LimitPrice is "+actionPara.getStopLossParameter().getLimitPrice());
			detailList.add("StopWin LimitPrice is "+actionPara.getStopWinParameter().getLimitPrice());
		}
	}
	
	private void openPosition(String currentPrice,BigDecimal size,String tradeType) {
		openPrice=currentPrice;
		actionPara.getStopLossParameter().setOpenPrice(openPrice);
		actionPara.getStopWinParameter().setOpenPrice(openPrice);
		isOpenPosition=true;
	}
	
	private void closePosition(String currentPrice, BigDecimal size, String tradeType) {
		closePrice=currentPrice;
		isClosed=true;
		profit=(tradeType.equals(OpenPositionParameter.buy)?new BigDecimal(-1):new BigDecimal(1)).multiply(new BigDecimal(closePrice).subtract(new BigDecimal(openPrice))).toString();
	}
	
	private SingleRecord getSingleRecord(String type,int index) {
		SingleRecord singleRecord=new SingleRecord(type).setCurrentOCHLIndex(index).setContent(content).setDetailsList(new ArrayList<>());
		record.add(singleRecord);
		return singleRecord;
	}
	
	public boolean isOpenPosition() {
		return isOpenPosition;
	}
	
	public boolean isClosed() {
		return isClosed;
	}
	public String getProfit() {
		return profit;
	}
}
