package OCHL;

import java.time.LocalDateTime;

public class OCHL{
	private String open;
	private String close;
	private String high;
	private String low;
	private String vol;
	private String color;
	LocalDateTime ldt;
	
	public OCHL(String open,String close,String high,String low,String vol,String ldt){
		update(open,close,high,low,vol,ldt);
	}
	
	public OCHL(OCHL o){
		update(o);
	}
	
	public void update(OCHL o){
		update(o.getOpen(),o.getClose(),o.getHigh(),o.getLow(),o.getVolume(),o.getDateTime());
	}
	
	public void update(String open,String close,String high,String low,String vol,String ldt){
		this.open=open;
		this.close=close;
		this.low=low;
		this.high=high;
		parseLocalDateTime(ldt);
		this.vol=vol.equals("")?"0.0":vol;
		setColor();
	}
	
	public OCHL update(String close,String vol){
		this.close=close;
		this.low=this.low.compareTo(close)==-1?this.low:close;
		this.high=this.high.compareTo(close)==1?this.high:close;
		this.vol=vol;
		setColor();
		return this;
	}
	
	private void setColor(){
		color=Double.valueOf(open)==Double.valueOf(close)?"gray":(Double.valueOf(open)>Double.valueOf(close))?"red":"green";
	}
	private String parseLocalDateTime(String s) {
		this.ldt=LocalDateTime.parse(s);
		return ldt.toString();
	}
	
	public String getOpen(){
		return open;
	}
	
	public String getClose(){
		return close;
	}
	
	public String getHigh(){
		return high;
	}
	
	public String getLow(){
		return low;
	}
	
	public String getVolume(){
		return vol;
	}
	
	public String getDateTime(){
		return ldt.toString();
	}
	
	public String getColor(){
		return color;
	}
	public LocalDateTime getLocalDateTime() {
		return ldt;
	}
	
	@Override
	public boolean equals(Object a){
		if(a.getClass().equals(OCHL.class))	return this.toString().equals(a.toString()); 
		else if (a.getClass().equals(String.class)) return this.ldt.toString().equals(a);
		else if (a.getClass().equals(LocalDateTime.class)) return this.ldt.equals(a);
		else return false;
	}
	
	@Override
	public String toString(){
		return "O="+open+";C="+close+";H="+high+";L="+low+";V="+vol+";T="+ldt.toString();
	}
}
