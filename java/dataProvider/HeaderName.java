package dataProvider;

public enum HeaderName {
	OPEN("open"),
	CLOSE("close"),
	HIGH("high"),
	LOW("low"),
	DATETIME("datetime"),
	VOLUME("volume");
	
	private String name;
	HeaderName(String name){
		this.name=name;
	}
	
	public String getName() {
		return name;
	}
}
