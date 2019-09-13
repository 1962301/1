package Strategy;

import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import action.Action;
import action.ActionManager;
import condition.Condition;
import period.Period;
import statementProperties.StatementProps;

public class StrategyBuilder {
	private static HashMap<String,HashMap<String,String>> originalStrategyMap;
	
	public static Strategy build(String path,ActionManager actionManager) {
		originalStrategyMap=read(path);
		return setStrategy(actionManager);
	}
	
	public static Strategy build(String path,String bucket,ActionManager actionManager,AmazonS3 s3client) {
		originalStrategyMap=read(bucket,path,s3client);
		return setStrategy(actionManager);
	}
	
	static private Strategy setStrategy(ActionManager actionManager) {
		String iniEnterStatementIndex=originalStrategyMap.get("entry").get("t");
		boolean waitForNextCandle=Boolean.valueOf(originalStrategyMap.get("otherParameters").get("waitForNextCandle"));
		Period period=null;
		if(originalStrategyMap.get("otherParameters").get("periodLength")!=null&&originalStrategyMap.get("otherParameters").get("periodUnit")!=null) {
			period=new Period(Integer.parseInt(originalStrategyMap.get("otherParameters").get("periodLength")),originalStrategyMap.get("otherParameters").get("periodUnit"));
		}
		
		Strategy strategy=new Strategy(iniEnterStatementIndex,period,waitForNextCandle);
		for(String entry:originalStrategyMap.keySet()) {
			if(!entry.equals("entry")) {
				strategy.add(entry, new SingleStrategySentence(
						new Condition(originalStrategyMap.get(entry).get("condition"),strategy),
						originalStrategyMap.get(entry).get("action"),
						originalStrategyMap.get(entry).get("t"),
						originalStrategyMap.get(entry).get("f"),
						actionManager
					).setIndex(entry));
			}
		}
		return strategy;
	}

	public static HashMap<String,HashMap<String,String>> read(String path){
		try(FileReader fr=new FileReader(path)){
			ObjectMapper mapper=new ObjectMapper();
			HashMap<String,HashMap<String,String>> strategyMap=mapper.readValue(fr,new TypeReference<HashMap<String,HashMap<String,String>>>() {});
			return strategyMap;		
		}catch(Exception e) {
			throw new StrategyException("StrategyBuilder Class, read, can't find file with path="+path);
		}
	}
	
	public static HashMap<String,HashMap<String,String>> read(String bucket,String path,AmazonS3 s3client){
		try {
			S3Object s3=s3client.getObject(bucket,path);	
			ObjectMapper mapper=new ObjectMapper();
			HashMap<String,HashMap<String,String>> strategyMap=mapper.readValue(s3.getObjectContent(),new TypeReference<HashMap<String,HashMap<String,String>>>() {});
			s3.close();
			return strategyMap;
		}catch(Exception e) {
			throw new StrategyException("StrategyBuilder Class, read, can't find file with path="+path);
		}
		/*
		try(FileReader fr=new FileReader(path)){
			ObjectMapper mapper=new ObjectMapper();
			HashMap<String,HashMap<String,String>> strategyMap=mapper.readValue(fr,new TypeReference<HashMap<String,HashMap<String,String>>>() {});
			return strategyMap;		
		}catch(Exception e) {
			throw new StrategyException("StrategyBuilder Class, read, can't find file with path="+path);
		}
		*/
	}
	
}