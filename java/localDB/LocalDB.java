package localDB;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.math.BigDecimal;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.stream.Stream;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import OCHL.OCHL;
import dataProvider.DataProvider;

public class LocalDB {
	private String[] nameArr=new String[] {"datetime","open","close","high","low","vol"};
	private String path="C:\\Users\\Administrator\\Front Project\\OpenQuant\\data";
	

	private Connection getConnection() throws SQLException {
		
		return DriverManager.getConnection("jdbc:postgresql://aa108g2q7g23wc5.cmzbhlyuzke6.us-west-2.rds.amazonaws.com/postgres","cc1962301","woaiwo1623");
	}
	
	public ArrayList<OCHL> getDateFromFile(String fileName) {
		ArrayList<OCHL> dataList=new ArrayList<>();
		try(FileReader fr=new FileReader(path+"\\"+fileName);BufferedReader br=new BufferedReader(fr)){
			String line="";
			int count=1;
			while((line=br.readLine())!=null) {
				String[] arr=line.split(",");
				if(count!=1) {
					dataList.add(getOCHL(arr));
				}
				count++;
			}
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		System.out.println("done read");
		System.out.println(dataList.size());
		return dataList;
	}
	
	public ArrayDeque<OCHL> getDateFromDB(String tableName){
		long time1=System.nanoTime();
		ArrayDeque<OCHL> dataList=new ArrayDeque<OCHL>();
		try {
			Connection connection=getConnection();
			connection.setAutoCommit(false);
			Statement st=connection.createStatement();
			st.setFetchSize(50000);
			ResultSet rs=st.executeQuery("SELECT * FROM "+tableName);
			
			int count=0;
			while(rs.next()) {
				dataList.add(new OCHL(rs.getString("open"),rs.getString("close"),rs.getString("high"),rs.getString("low"),rs.getString("vol"),rs.getString("datetime")));	
				count++;
			}
			System.out.println("get data from db:"+count);
			
		}catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		long time2=System.nanoTime();
		
		System.out.println("get data time:"+(time2-time1));
		return dataList;
	}
	
	private OCHL getOCHL(String[] arr) {
		try {
			String datetime=getDateTime1(arr);
			String open=arr[3];
			String close=arr[6];
			String high=arr[4];
			String low=arr[5];
			String vol=arr[7];
			return new OCHL(open,close,high,low,vol,datetime);
		}catch(Exception e) {
			try {
				String datetime=getDateTime2(arr);
				String open=arr[2];
				String close=arr[5];
				String high=arr[3];
				String low=arr[4];
				String vol=arr[6];
				return new OCHL(open,close,high,low,vol,datetime);	
			}catch(Exception e1) {
				String datetime=arr[0];
				String open=arr[1];
				String close=arr[2];
				String high=arr[3];
				String low=arr[4];
				String vol=arr[5];
				return new OCHL(open,close,high,low,vol,datetime);
			}
		}
	}
	
	private String getDateTime1(String[] arr) {
		String date=arr[1].substring(0, 4)+"-"+arr[1].substring(4, 6)+"-"+arr[1].substring(6);
		int time=Integer.parseInt(arr[2]);
		int h=time/10000;
		int m=(time-time/10000*10000)/100;
		String hour=h==0?"00":h>=10?String.valueOf(h):"0"+String.valueOf(h);
		String minute=m==0?"00":m>=10?String.valueOf(m):"0"+String.valueOf(m);
		String datetime=date+"T"+hour+":"+minute;
		return datetime;
	}
	
	private String getDateTime2(String[] arr) {
		String date=arr[0].substring(0, 4)+"-"+arr[0].substring(4, 6)+"-"+arr[0].substring(6);
		String time=arr[1].length()==7?"0"+arr[1]:arr[1];
		return date+"T"+time.substring(0,5);
	}
	
	void insertDB(String tableName,ArrayList<OCHL> list) {
		String SQL="INSERT INTO "+tableName+"(DateTime,open,close,high,low,vol) VALUES(?,?,?,?,?,?)";
		try {
			Connection connection=getConnection();
			PreparedStatement s=connection.prepareStatement(SQL);
			int count=0;
			for(OCHL ochl:list) {
				//s.setString(1, ochl.getDateTime());
				s.setTimestamp(1, Timestamp.valueOf(ochl.getLocalDateTime()));
					
				s.setBigDecimal(2, new BigDecimal(ochl.getOpen()));
				s.setBigDecimal(3, new BigDecimal(ochl.getClose()));
				s.setBigDecimal(4, new BigDecimal(ochl.getHigh()));
				s.setBigDecimal(5, new BigDecimal(ochl.getLow()));
				s.setBigDecimal(6, new BigDecimal(ochl.getVolume()));
				s.addBatch();
				count++;
							
				if(count%1000==0||count==list.size()) {
					System.out.println(count);
					s.executeBatch();
				}
			}
			connection.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	ArrayList<OCHL> readTestData(){
		ArrayList<OCHL> dataList=new ArrayList<>();
		
		File[] fileArr=new File("C:\\Users\\Administrator\\eclipse-workspace\\CEIC IG\\Data\\Oil Brent Crude").listFiles();
		String[] dataPathArr=new String[fileArr.length];
		for(int i=0;i<fileArr.length;i++) {
			dataPathArr[i]=fileArr[i].getAbsolutePath();
		}
		

		for(String path:dataPathArr) {
			try(FileReader fr=new FileReader(path);BufferedReader br=new BufferedReader(fr)){
				String line;
				int i=0;
				while((line=br.readLine())!=null) {
					String[] t=line.split(",");
					if(i!=0) {
						dataList.add(new OCHL(t[11],t[12],t[13],t[14],t[16],t[0]));
						
					}
					i++;
				}
					
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		};
		//System.out.println(dataList.size());
		//System.out.println(dataList);
		return dataList;
	}
	
	void getS3() {
		String accessKey="AKIAIOFZXIQIOR5MSVYQ";
		String secretKey="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";
		AWSCredentials credentials =new BasicAWSCredentials(accessKey,secretKey);
		AmazonS3 s3client=AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(Regions.US_WEST_2).build();
		String bucketName="web1962301";
		
		/*
		if(s3client.doesBucketExistV2(bucketName)) {
			System.out.println("find "+bucketName);
		}
		for(Bucket b:s3client.listBuckets()) {
			System.out.println(b.getName());
		}
		ObjectListing a=s3client.listObjects(bucketName);
		for(S3ObjectSummary summary:a.getObjectSummaries()) {
			System.out.println(summary.getKey());
		}
		*/

		
		
		
		HashMap<String,HashMap<String,String>> g=new HashMap<>();
		g.put("1", new HashMap<>());
		g.get("1").put("condition", "x+y>1");
		g.get("1").put("action", "good");
		g.put("2", new HashMap<>());
		g.get("2").put("condition", "x+y>2");
		g.get("2").put("action", "bad");
		
		String x="{" + 
				"\"glossary\": {" + 
				"\"title\": \"example glossary\"," + 
				"\"GlossDiv\": {" + 
				"\"title\": \"S\"," + 
				"\"GlossList\": {" + 
				"\"GlossEntry\": {" + 
				"\"ID\": \"SGML\"," + 
				"\"SortAs\": \"SGML\"," + 
				"\"GlossTerm\": \"Standard Generalized Markup Language\"," + 
				"\"Acronym\": \"SGML\",\r\n" + 
				"\"Abbrev\": \"ISO 8879:1986\"," + 
				"\"GlossDef\": {" + 
				"\"para\": \"A meta-markup language, used to create markup languages such as DocBook.\"," + 
				"\"GlossSeeAlso\": [\"GML\", \"XML\"]" + 
				"}," + 
				"\"GlossSee\": \"markup\"" + 
				"}" + 
				"}" + 
				"}" + 
				"}" + 
				"}";
		
		
		ObjectMapper mapper=new ObjectMapper();
		try {
			String pretty=mapper.writerWithDefaultPrettyPrinter().writeValueAsString(g);				
		
	
			
			ObjectMetadata s3ObjectMetadata = new ObjectMetadata();
			s3client.putObject(bucketName, "users/1.txt", pretty);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		
			S3Object s3object = s3client.getObject(bucketName, "users/1.txt");
			S3ObjectInputStream inputStream = s3object.getObjectContent();
		
		
		
		
		 try {
			java.nio.file.Files.copy(inputStream.getDelegateStream(), new File("c:\\1\\hello.txt").toPath(),StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
			 

		
	}
	
	
	public static void main(String[] arg) {
		LocalDB l=new LocalDB();
		l.getS3();
		//l.insertDB("testbrentoildata", l.getDateFromFile("testBrentOilData.csv"));
		//l.getDateFromDB("oiltest");
		//l.insertDB("brentoil", l.getDateFromFile("布伦特原油-1M-2013.1.1-2019.7.csv"));
	}
	
}
