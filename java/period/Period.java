package period;
import java.time.temporal.ChronoUnit;

public class Period {
	private int periodLength;
	private ChronoUnit periodUnit;
	
	public Period(int periodLength, String unit){
		this.periodLength=periodLength;
		this.periodUnit=PeriodUnit.getUnit(unit);
	}
	
	public int getPeriodLength() {
		return periodLength;
	}
	public ChronoUnit getPeriodUnit() {
		return this.periodUnit;
	}
	
	@Override
	public String toString() {
		return "period length="+periodLength+"  period unit="+periodUnit;
	}
}
