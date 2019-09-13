package com.example.demo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import javax.servlet.http.HttpServletRequest;

import org.apache.tomcat.util.json.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unboundid.util.json.JSONObject;

import OCHL.OCHL;
import Strategy.StrategyBuilder;
import Strategy.StrategyException;
import action.OpenPositionParameter;
import analyse.Analyse;
import io.micrometer.core.instrument.util.IOUtils;
import record.Record;
import statementProperties.SingleRecord;

@RestController
public class RestMapping {
	private int requestNumberLimit=20000;
	private int recordLimit=500;
	@Autowired
	private DBServices dbServices;
	private String accessKey="AKIAIOFZXIQIOR5MSVYQ";
	private String secretKey="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";
	private AWSCredentials credentials =new BasicAWSCredentials(accessKey,secretKey);
	private AmazonS3 s3client=AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(Regions.US_WEST_2).build();
	private String bucketName="web1962301";
	
	

	@RequestMapping(value="/getTableNames",method=RequestMethod.GET)
	@CrossOrigin("*")		//******************solve cross origin problem, just for Testing use*******************************//
	public List<Map<String,Object>> getDBFiles(){
		return dbServices.getTableNames(checkAnonymous()?"":getUserName());
	}
	
	@RequestMapping(value="/updateFileSys",method=RequestMethod.POST)
	@CrossOrigin("*")
	public List<Map<String,Object>> updateFileSys(@RequestBody Map<String,String> params){
		String action=getPara(params,"action");
		if(action.toLowerCase().equals("delete")) return dbServices.deleteDir(getPara(params,"path"), this.getUserName(),bucketName,s3client);
		else if(action.toLowerCase().equals("create")) return dbServices.createDir(getPara(params,"path"), this.getUserName());
		else if(action.toLowerCase().equals("rename"))	return dbServices.renameDir(getPara(params,"originalPath"),getPara(params,"newPath"),this.getUserName(),bucketName,s3client);
		return null;
	}
	

	@RequestMapping(value="/hasLogin",method=RequestMethod.GET)
	@CrossOrigin("*")		//******************solve cross origin problem, just for Testing use*******************************//
	public Map<String,Object> hasLogin(){	
		try {
			if(this.checkAnonymous()) return getLoginInfo("false","");
			else return getLoginInfo("true",this.getUserName());
		}catch(DataAccessException e) {
			Map<String,Object> m=new HashMap<>();
			m.put("error", "database error");
			return m;
		}
	}
	
	private Map<String,Object> getLoginInfo(String status,String userName){
		Map<String,Object> a=new HashMap<>();
		a.put("status", status);
		a.put("userName", userName);
		a.put("fileSys", this.getDBFiles());
		return a;
	}
	
	@RequestMapping(value="/getStrategyFile",method=RequestMethod.POST)
	@CrossOrigin("*")
	public HashMap<String,?> getStrategyFile(@RequestBody Map<String,String> params) {
		String frontFile=getPara(params,"fileName");
		String realFilePath=dbServices.getStrategyFilePath(frontFile,this.getUserName());
		if(!realFilePath.startsWith("sysfiles")) {
			realFilePath="users/"+this.getUserName()+"/"+realFilePath;
		}
		System.out.println("realFilePath="+realFilePath);
		//return StrategyBuilder.read(realFilePath);
		try {	return StrategyBuilder.read(bucketName, realFilePath, s3client);}
		catch(Exception e) {
			HashMap<String,String> infoMap=new HashMap<>();
			infoMap.put("error", "the file doesn't exist or empty file");
			return infoMap;
		}
	}
	
	@RequestMapping(value="/getData",method=RequestMethod.POST)
	@CrossOrigin("*")
	public List<Map<String, Object>> getDate(HttpServletRequest request,@RequestBody Map<String,String> params){	
		for(String key:params.keySet()) {
			System.out.println(key+":"+params.get(key));
		}
		return dbServices.getDataForFront(params.get("fileName"),params.get("offset"),getUserName());
	}
	@RequestMapping(value="/getTargetData",method=RequestMethod.POST)
	@CrossOrigin("*")
	public List<Map<String,Object>> getTargetData(@RequestBody Map<String,String> params){
		for(String key:params.keySet()) {
			System.out.println(key+":"+params.get(key));
		}
		return dbServices.getTargetData(params.get("fileName"),params.get("timestamp"),getUserName());
	}
	
	@RequestMapping(value="/save",method=RequestMethod.POST)
	@CrossOrigin("*")
	public Map<String,String> save(@RequestBody Map<String,Object> params, HttpServletRequest request) {
		HashMap<String,String> infoMap=new HashMap<>();
		String user=this.getUserName();
		String fileName=params.get("fileName")==null?null:params.get("fileName").toString();
		if(fileName==null||fileName.equals(""))	infoMap.put("error", "Please select/open a file");
		else if(fileName.toUpperCase().startsWith("EXAMPLE")) infoMap.put("normal", "System Example File are not allowed to modify");
		else if(user==null&&!fileName.toUpperCase().startsWith("EXAMPLE")) infoMap.put("error", "you don't have authority to modify the file, please login");
		else if(user!=null&&!fileName.toUpperCase().startsWith("EXAMPLE")&&!fileName.toUpperCase().startsWith(user.toUpperCase())) infoMap.put("error", "you don't have authority to modify other user's file");
		else {
			Object fileContent=params.get("fileContent");
			if(fileContent==null) infoMap.put("error","no file content found");
			else {
				System.out.println("fileContent="+fileContent.toString());
				System.out.println("filename="+params.get("fileName").toString());
				try {
					String filePath=dbServices.getStrategyFilePath(fileName,user);
					System.out.println("filePath="+filePath);
					if(filePath==null) infoMap.put("error", "can't find file or file belongs to system");
					else if(filePath.startsWith("sysfiles")) {}
					else {
						ObjectMapper mapper=new ObjectMapper();
						mapper.convertValue(fileContent, new TypeReference<HashMap<String,HashMap<String,String>>>() {});				
						try {
							String prettyContent=mapper.writerWithDefaultPrettyPrinter().writeValueAsString(fileContent);
							s3client.putObject(bucketName, "users/"+user+"/"+filePath, prettyContent);
							
							//mapper.writerWithDefaultPrettyPrinter().writeValue(new File("C:\\Users\\Administrator\\Front Project\\OpenQuant\\StrategyFile\\"+user+"\\"+params.get("fileName")), fileContent);
						} catch (JsonGenerationException e) {
							e.printStackTrace();
							infoMap.put("error", "JSON generation exception");
						} catch (JsonMappingException e) {
							e.printStackTrace();
							infoMap.put("error", "JsonMappingException");
						} catch (IOException e) {
							e.printStackTrace();
							infoMap.put("error", "IOException");
						}
					}
				}
				catch (EmptyResultDataAccessException e) {
					infoMap.put("error", "can't find file or file belongs to system");
				}	
			}
		}
		return infoMap;
	}
	
	@RequestMapping(value="/run",method=RequestMethod.POST)
	@CrossOrigin("*")
	public HashMap<String,Object> run(@RequestBody Map<String,String> params){
		HashMap<String,Object> infoMap=new HashMap<String,Object>();
		try {
			String user=this.getUserName();
			String strategyFileName=getPara(params,"strategyFile");
			String dataFileName=getPara(params,"dataFile");
			
			if(strategyFileName==null||dataFileName==null) infoMap.put("error", "please specify a strategyFile or dataFile");
			else if(user==null&&(!strategyFileName.toUpperCase().startsWith("EXAMPLE")||!dataFileName.toUpperCase().startsWith("EXAMPLE"))) infoMap.put("error", "you don't have the authority to access the file");
			else if(user!=null&&(!strategyFileName.toUpperCase().startsWith("EXAMPLE")&&!strategyFileName.toUpperCase().startsWith(user.toUpperCase()))) infoMap.put("error", "you don't have the authority to access the file");
			else if(user!=null&&(!dataFileName.toUpperCase().startsWith("EXAMPLE")&&!dataFileName.toUpperCase().startsWith(user.toUpperCase()))) infoMap.put("error", "you don't have the authority to access the file");
			else {
				Timestamp startDateTime= parseDateTime(getPara(params,"startDateTime"));
				Timestamp endDateTime=parseDateTime(getPara(params,"endDateTime"));;
				
				int numberPoints=Integer.valueOf(getPara(params,"numPoints"));		
				if(numberPoints>requestNumberLimit||numberPoints<=0) numberPoints=requestNumberLimit;
	
				ArrayDeque<OCHL> ad=new ArrayDeque<>(dbServices.getDateForAnalyse(dataFileName, startDateTime,endDateTime,numberPoints,getUserName()));
				
				
				if(ad.size()!=0) {
				
					String realStrategyFilePath=dbServices.getStrategyFilePath(strategyFileName,getUserName());
		
					Analyse a=new Analyse(ad,realStrategyFilePath,bucketName,s3client,recordLimit,1,"m");
					a.run();
					
					ArrayList<ArrayList<String>> recordList=new ArrayList<>(); 
					for(Record r:a.getRecordMap().values()) {
						if(r.isClosed()) {
							try {
								ArrayList<String> temp=new ArrayList<>();
								String datetime=Timestamp.valueOf(a.getDataList().get(r.getDetectedIndex()).getLocalDateTime()).toString();
								String tradeType=r.getOpenTradeType();
								String openPrice=r.getOpenPrice();
								String closePrice=r.getClosePrice();
								String profit=(tradeType.equals(OpenPositionParameter.buy)?new BigDecimal(1):new BigDecimal(-1)).multiply(new BigDecimal(closePrice).subtract(new BigDecimal(openPrice))).toString();
								
								temp.add(datetime+":  open("+tradeType+") at "+openPrice+"  close at "+closePrice+"  profit="+profit);
								boolean open=false;
								for(SingleRecord s:r.getAllRecord()) {			
									if(s.getResult()) {
										String dt=Timestamp.valueOf(a.getDataList().get(Integer.valueOf(s.getCurrentOCHLIndex())).getLocalDateTime()).toString();
										String content=s.getContent();
										String price=a.getDataList().get(Integer.valueOf(s.getCurrentOCHLIndex())).getClose();
										if(content.indexOf("condition")!=-1) {
											content=content.substring(content.indexOf("condition"),content.indexOf("Action"));
											temp.add(dt+":  current price:"+price+";    "+content);
										}
										else {
											if(!open) {
												content=content.substring(0,content.indexOf("}")+1);
												temp.add(dt+":   open at:"+price+";    "+content);
												open=true;
											}
											else {
												content=content.substring(content.indexOf("close"));
												temp.add(dt+":   close at:"+price+";    "+content);
											}
										}
										
										
									}
								}
								recordList.add(temp);
							}catch(Exception e) {e.printStackTrace();}
						}
					};
					infoMap.put("data", recordList);
					
					try(FileWriter fw=new FileWriter("C:\\1\\total.txt");BufferedWriter bw=new BufferedWriter(fw)){
						for(ArrayList<String> tempList:recordList) {
							int i=0;
							for(String s:tempList) {
								if(i==0) bw.append(s);
								else bw.append("      "+s);
								bw.newLine();
								i++;
							}
						}
						bw.flush();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				else infoMap.put("error", "selecting file or datetime results no qualified data");
			}
		}
		catch(NullPointerException e1) {
			infoMap.put("error",e1.getMessage());
		}
		catch (ParseException e2) {
			infoMap.put("error", e2.getMessage());
		}
		catch (NumberFormatException e3) {
			infoMap.put("error", e3.getMessage());
		}
		catch (Exception e4) {
			infoMap.put("error", e4.getMessage());
		}
		
		
		return infoMap;
	}
	
	private String getPara(Map<String,String> params, String key) {
		if(params.get(key)==null) throw new NullPointerException("parameter "+key+" has not been set, valid value includes ''");
		else return params.get(key);
	}
	
	private Timestamp parseDateTime(String datetime) throws ParseException {
		if(datetime.equals("")) return null;
		else {
			SimpleDateFormat s1=new SimpleDateFormat("yyyy-MM-dd HH:mm");
			try {
				Date d1=s1.parse(datetime);
				return Timestamp.from(d1.toInstant());
			} catch (ParseException e1) {
				SimpleDateFormat s2=new SimpleDateFormat("yyyy-MM-dd");
				try {
					Date d2=s2.parse(datetime);
					return Timestamp.from(d2.toInstant());
				} catch (ParseException e2) {
					throw new ParseException("datetime format error: should be yyyy-MM-dd HH:mm or yyyy-MM-dd or '', current datetime="+datetime,0);
				}
			}	
		}
	}
	private boolean checkAnonymous() {
		Authentication auth=SecurityContextHolder.getContext().getAuthentication();
		for(GrantedAuthority a : auth.getAuthorities()) {
			System.out.println("role="+a.getAuthority());
			if(a.getAuthority().equals("ROLE_ANONYMOUS")) return true;;
		}
		return false;
	}
	private String getUserName() {
		if(this.checkAnonymous()) return null;
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}
	
	
}
