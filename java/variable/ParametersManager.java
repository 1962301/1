package variable;

import java.util.ArrayList;

public class ParametersManager {
	private ArrayList<Parameters> paraList=new ArrayList<>();
	private int offsetStartLowerBound;
	private int offsetStartUpperBound;
	private int offsetEndLowerBound;
	private int offsetEndUpperBound;
	
	public Parameters getNewParametersInstance(String[] paraArr,int sign) {
		Parameters p=new Parameters(paraArr,sign);
		
		setOffsetStartBound(p.getOffsetStart());
		setOffsetEndBound(p.getOffsetEnd());
		
		paraList.add(p);
		return p;
	}
	
	public int getOffsetStartLowerBound() {
		return offsetStartLowerBound;
	}
	public int getOffsetStartUpperBoundOff() {
		return offsetStartUpperBound;
	}
	public int getOffsetEndLowerBound() {
		return offsetEndLowerBound;
	}
	public int getOffsetEndUpperBound() {
		return offsetEndUpperBound;
	}
	
	private void setOffsetStartBound(int newInput){
		if(newInput<offsetStartLowerBound) 		offsetStartLowerBound=newInput;
		else if(newInput>offsetStartUpperBound)	offsetStartUpperBound=newInput;
	}
	
	private void setOffsetEndBound(int newInput) {
		if(newInput<offsetEndLowerBound) offsetEndLowerBound=newInput;
		else if(newInput>offsetEndUpperBound) offsetEndUpperBound=newInput;
	}
}
