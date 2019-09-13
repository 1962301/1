package dataProvider;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;

import OCHL.OCHL;

public class Headers {
	public static enum HeaderName{
		open("open");
		
		private String name;
		HeaderName(String name){
			this.name=name;
		}
	};
	public static final String open="open";
	public static final String close="close";
	public static final String high="high";
	public static final String low="low";
	public static final String volume="volume";
	public static final String datetime="datetime";

	private HashMap<String,Integer> priorityMap=new HashMap<>();
	private HashMap<String,Integer> indexMap=new HashMap<>();
	private HashMap<String,Boolean> settingMap=new HashMap<>();

	
	public Headers() {
		defaultSetting();
	}
	private void defaultSetting() {
		indexMap.put(datetime, 0);
		indexMap.put(open, 1);
		indexMap.put(close, 2);
		indexMap.put(high, 3);
		indexMap.put(low, 4);
		indexMap.put(volume, 5);
		settingMap.put(datetime, false);
		settingMap.put(open, false);
		settingMap.put(close, false);
		settingMap.put(high, false);
		settingMap.put(low, false);
		settingMap.put(volume, false);
	}
	
	public Headers setHeaders(String a1,int index) {
		indexMap.put(a1, index);
		return this;

	}
	public void setHeaders(String[] h) {
		String a="";
		for(String s:h) a+=s+",";

		if(h.length<6) throw new DataProviderException("Headers Class, setHeaders, input value arr length is less than 6, length="+h.length+" content="+a);
		
		defaultSetting();
		
		for(int i=0;i<h.length;i++) {
			for(String k:indexMap.keySet()){
				String s=h[i].toLowerCase();
				if(s.matches("\\w+.*")&&(s.contains(k)||k.contains(s))) {	
					settingMap.put(k, true);
					int priority=getPriority(s);
					if(priorityMap.get(k)==null||priorityMap.get(k)<=priority) {
						priorityMap.put(k, priority);
						indexMap.put(k, i);
					}
				}
			}
		}
		if(settingMap.values().contains(false)) {
			defaultSetting();
			throw new DataProviderException("Headers Class, setHeaders, input arr doesn't have enough items to setting all required fields arr="+a+"---"+settingMap);
		}

	}
	
	private int getPriority(String s) {
		int priority=0;
		if		(s.matches(".*ask.*bid.*|.*bid.*ask.*")) 	priority=3;
		else if	(s.contains("ask"))				 			priority=2;
		else if	(s.contains("bid")) 						priority=1;
		else 												priority=4;
		return priority;
	}
	
	/**
	 * DataProvider Class has set an order of headers for a file, according to that order, rearrange the values in file to match the value order required for OCHL class 
	 * @author cc
	 * @param v String Array for new OCHL values, the default order is [open,close, high,low, volume , datetime]
	 * @return new OCHL instance
	 */
	public OCHL getOCHL(String[] v) {
		if(v.length<6) {
			String a="";
			for(String s:v) a+=s+",";
			throw new DataProviderException("Headers Class, setHeaders, input value arr length is less than 6, length="+v.length+" content="+a);
		}
		return new OCHL(v[indexMap.get(open)],v[indexMap.get(close)],v[indexMap.get(high)],v[indexMap.get(low)],v[indexMap.get(volume)],v[indexMap.get(datetime)]);
		
	}
	
	public int getOpenIndex() {
		return indexMap.get(open);
	}
	public int getCloseIndex() {
		return indexMap.get(close);
	}
	public int getHighIndex() {
		return indexMap.get(high);
	}
	public int getLowIndex() {
		return indexMap.get(low);
	}
	public int getvolumeIndex() {
		return indexMap.get(volume);
	}
	public int getDatetimeIndex() {
		return indexMap.get(datetime);
	}
	public String getOpenName() {
		return open;
	}
	public String getCloseName() {
		return close;
	}
	public String getHighName() {
		return high;
	}
	public String getLowName() {
		return low;
	}
	public String getvolumeName() {
		return volume;
	}
	public String getDatetimeName() {
		return datetime;
	}

	public String[] getHeaders() {
		return indexMap.values().toArray(new String[0]);
	}	
	
}
