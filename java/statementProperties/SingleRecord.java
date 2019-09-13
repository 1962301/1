package statementProperties;

import java.util.ArrayList;

public class SingleRecord {
	public final static String open="open";
	public final static String close="close";
	public final static String condition="condition";
	
	private final String type;
	private int currentOCHLIndex;
	private ArrayList<String> detailsList;
	private String content;
	private boolean result;

	public SingleRecord(String type) {
		this.type=type;
	}
	public SingleRecord setCurrentOCHLIndex(int currentOCHLIndex) {
		this.currentOCHLIndex=currentOCHLIndex;
		return this;
	}
	public SingleRecord setDetailsList(ArrayList<String> detailsList) {
		this.detailsList=detailsList;
		return this;
	}
	public SingleRecord setContent(String content) {
		this.content=content;
		return this;
	}

	public String getCurrentOCHLIndex() {
		return String.valueOf(currentOCHLIndex);
	}
	public ArrayList<String> getDetailsList(){
		if(detailsList==null) return new ArrayList<>();
		return detailsList;
	}
	public String getContent() {
		return content;
	}
	public SingleRecord setResult(boolean result) {
		this.result=result;
		return this;
	}
	public boolean getResult() {
		return this.result;
	}
	public String getType() {
		return type;
	}
}
