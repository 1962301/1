package parseValue;

import java.util.HashMap;

public class ParseValueFactory {
	private static HashMap<String,ParseValue> vMap=new HashMap<>();
	static {
		vMap.put("clo", new CloseValue());
		vMap.put("o", 	new OpenValue());
		vMap.put("h", 	new HighValue());
		vMap.put("low", new LowValue());
		vMap.put("vol", new VolumnValue());
		vMap.put("col", new ColorValue());
		vMap.put("DT",  new DateTimeValue());
		vMap.put("HLM", new HighLowMidValue());
		vMap.put("OCM", new OpenCloseMidValue());
		vMap.put("BH", 	new BodyHighValue());
		vMap.put("BL", 	new BodyLowValue());
		vMap.put("OEC", new OpenEqualsClose());
		vMap.put("OBC", new OpenBiggerThanClose());
		vMap.put("CBO", new CloseBiggerThanOpen());
	}
	public static ParseValue getValue(String s) {
		if(vMap.get(s)!=null) return vMap.get(s);
		else throw new ParseValueException("ParseValueFactory Class, can't get a ParseValue Instance with input="+s);
	}
	
	public static ParseValue getBodyHighValue() {
		return vMap.get("BH");
	}
	public static ParseValue getBodyLowValue() {
		return vMap.get("BL");
	}
	public static ParseValue getCloseValue() {
		return vMap.get("clo");
	}
	public static ParseValue getColorValue() {
		return vMap.get("col");
	}
	public static ParseValue getDateTimeValue() {
		return vMap.get("DT");
	}
	public static ParseValue getHighLowMidValue() {
		return vMap.get("HLM");
	}
	public static ParseValue getHighValue() {
		return vMap.get("h");
	}
	public static ParseValue getLowValue() {
		return vMap.get("low");
	}
	public static ParseValue getOpenCloseMidValue() {
		return vMap.get("OCM");
	}
	public static ParseValue getOpenValue() {
		return vMap.get("o");
	}
	public static ParseValue getVolumnValue() {
		return vMap.get("vol");
	}
	public static ParseValue getOpenEqualsClose() {
		return vMap.get("OEC");
	}
	public static ParseValue getOpenBiggerThanClose() {
		return vMap.get("OBC");
	}
	public static ParseValue getCloseBiggerThanOpen() {
		return vMap.get("CBO");
	}
	
}
