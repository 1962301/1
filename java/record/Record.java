package record;

import java.util.ArrayList;

import statementProperties.SingleRecord;

public class Record {
	private ArrayList<SingleRecord> list=new ArrayList<>();
	private int index;
	private boolean opened=false;
	private boolean closed=false;
	private String openPrice;
	private String closePrice;
	private String openTradeType;
	
	public Record(int detectedIndex) {
		this.index=detectedIndex;
	}
	public void add(SingleRecord singleRecord) {
		list.add(singleRecord);		
	}

	public void setDetectedIndex(int i) {
		this.index=i;
	}
	public int getDetectedIndex() {
		return index;
	}
	public void setOpened(boolean opened) {
		this.opened=opened;
	}
	public void setClosed(boolean closed) {
		this.closed=closed;
	}
	public void setOpened(boolean opened, String openPrice,String openType) {
		this.opened=opened;
		this.openPrice=openPrice;
		this.openTradeType=openType;
	}
	public void setClosed(boolean closed, String closePrice) {
		this.closed=closed;
		this.closePrice=closePrice;
	}
	
	public ArrayList<SingleRecord> getAllRecord(){
		return list;
	}
	
	public boolean isEmpty() {
		return list.size()==0;
	}
	public boolean isOpened() {
		return opened;
	}
	public boolean isClosed() {
		return closed;
	}
	public String getOpenPrice() {
		return openPrice;
	}
	public String getClosePrice() {
		return closePrice;
	}
	public String getOpenTradeType() {
		return this.openTradeType;
	}

}
