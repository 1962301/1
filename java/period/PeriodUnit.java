package period;

import java.time.temporal.ChronoUnit;
import java.util.HashMap;

public class PeriodUnit {
	static private HashMap<String,ChronoUnit> datetimeUnitMap=new HashMap<>();
	static {
		datetimeUnitMap.put("ms", ChronoUnit.MILLIS);
		datetimeUnitMap.put("s", ChronoUnit.SECONDS);
		datetimeUnitMap.put("m", ChronoUnit.MINUTES);
		datetimeUnitMap.put("h", ChronoUnit.HOURS);
		datetimeUnitMap.put("d", ChronoUnit.DAYS);
		datetimeUnitMap.put("D", ChronoUnit.DAYS);
		datetimeUnitMap.put("w", ChronoUnit.WEEKS);
		datetimeUnitMap.put("W", ChronoUnit.WEEKS);		
		datetimeUnitMap.put("M", ChronoUnit.MONTHS);
		datetimeUnitMap.put("Y", ChronoUnit.YEARS);
		datetimeUnitMap.put("y", ChronoUnit.YEARS);
	}
	public static ChronoUnit getUnit(String s) {
		if(datetimeUnitMap.get(s)!=null) return datetimeUnitMap.get(s);
		else throw new PeriodException("PeriodUnit Class, can't find unit with input="+s);
	}
}
