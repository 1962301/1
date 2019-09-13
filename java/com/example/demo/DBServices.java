package com.example.demo;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.amazonaws.services.s3.AmazonS3;

import OCHL.OCHL;

@ComponentScan
@EnableAutoConfiguration
@Service
public class DBServices {
	@Autowired
	private JdbcTemplate jdbc;
	private int limitRowNumber=200;
	private String rootPath="C:\\Users\\Administrator\\Front Project\\OpenQuant\\StrategyFile\\users";
	
	public void insertData() {
		
	}
	
	public List<Map<String,Object>> getTableNames(String username) {
		return jdbc.queryForList("SELECT frontfile,type FROM sysfiles"+(username.equals("")?"":(" union select frontfile, type from "+username+"_files")));
	}
	public String getStrategyFilePath(String frontfile,String username) {
		String sql="select get_real_address('"+frontfile+"'"+(username==null?"":(",'"+username+"'"))+")";
		return jdbc.queryForObject(sql,String.class);
	}

	/*
	public void updateDir(String oldDir, String newDir,String username) {
		jdbc.execute("update "+username+"TableNames set file=regexp_replace(file,'\\m"+oldDir+"','"+newDir+"')");
	}
	public void addDir(String dir,String type,String checkDir,String username) {
		
		jdbc.execute("insert into "+username+"TableNames(file,type) values('"+dir+"','"+type+"')");	
		jdbc.execute("delete from "+username+"TableNames where file='"+checkDir+"'");
	}
	*/
	public List<Map<String,Object>> deleteDir(String path,String username,String bucketName,AmazonS3 s3client) {
		List<Map<String,Object>>strategyFileList=jdbc.queryForList("select * from delete_dbtable_from_path('"+username+"','"+path+"')");
		for(Map<String,Object> a:strategyFileList) {
			s3client.deleteObject(bucketName, "users/"+username+"/"+a.get("delete_dbtable_from_path").toString());
			//String file=a.get("delete_dbtable_from_path").toString();
			//String fullPath=rootPath+"\\"+username+"\\"+file;
			//new File(fullPath).delete();
		}
		return this.getTableNames(username);
	}
	public List<Map<String,Object>> createDir(String path,String username) {
		String tempPath=this.getPathWithoutPostfix(path);
		
		if(tempPath.matches(".*[^\\w].*")) return this.getTableNames(username);
		else {
			String lastPara="";
			try {
				if(jdbc.queryForList("select * from "+username+"_files where frontfile='"+path+"'").size()!=0)	return this.getTableNames(username);
				else if(path.matches(".*\\.str")) 						lastPara="'file','"+path.replace("/", "_")+"'";					
				else if(path.matches(".*\\.data")) {
					lastPara="'file','"+tempPath+"'";
					jdbc.execute("create table "+tempPath+" (id serial primary key, datetime timestamp, open numeric, close numeric, high numeric, low numeric,vol numeric)");
				}
				else {
					List<Map<String,Object>> tempList=jdbc.queryForList("select frontfile from "+username+"_files where type='folder'");
					for(Map<String,Object> m:tempList) {				
						if(path.startsWith(m.get("frontfile").toString()))	jdbc.execute("delete from "+username+"_files where frontfile='"+m.get("frontfile")+"'");
					}			
					lastPara="'folder',''";
				}
			} catch (Exception e) {return this.getTableNames(username);}
	
			System.out.println("path="+path);
			jdbc.execute("insert into "+username+"_files values('"+path+"',"+lastPara+")");
			
			return this.getTableNames(username);
		}
	}
	public List<Map<String,Object>> renameDir(String originalPath,String newPath,String username,String bucketName,AmazonS3 s3client){
		System.out.println("originalPath="+originalPath+"   newPath="+newPath+"   username="+username);
		
		
		//String tempPath=this.getPathWithoutPostfix(newPath);
		List<Map<String,Object>> affectStrategyFileList=jdbc.queryForList("select * from  rename_file_sys('"+originalPath+"','"+newPath+"','"+username+"_files')");
		System.out.println("affectStrategyFileList="+affectStrategyFileList);
		
		for(Map<String,Object> m:affectStrategyFileList) {
			String needPlacePart=originalPath.replace("/", "_");
			String placedPath=newPath.replace("/", "_");
			String oldName=m.get("rename_file_sys").toString();
			String newName=oldName.replaceFirst(needPlacePart, placedPath);
			System.out.println("needPlacePart="+needPlacePart+"    placedPath="+placedPath+"    oldName="+oldName+"    newName="+newName);
			
			s3client.copyObject(bucketName, "users/"+username+"/"+oldName, bucketName, "users/"+username+"/"+newName);
			s3client.deleteObject(bucketName, "users/"+username+"/"+oldName);
		}
		
		/*
		if(oldRecord.size()==0)	return this.getTableNames(username);
		else if(oldRecord.size()>1) {
			System.err.print("db问题，有重复值");
			return this.getTableNames(username);
		}	//db问题，需要去重
		
		if(originalPath!=null&&newPath!=null) {
			if(originalPath.endsWith(".data")&&newPath.endsWith(".data")) {
				String paras="frontfile='"+newPath+"',realaddress='"+tempPath+"'";
				jdbc.execute("update "+username+"_files set "+paras+" where frontfile='"+originalPath+"'");
				jdbc.execute("alter table "+oldRecord.get(0).get("realaddress")+" rename to "+tempPath);
			}
			else if(originalPath.endsWith(".str")&&newPath.endsWith(".str")) {//&&this.renamePhysicalFile(oldRecord.get(0).get("realaddress").toString(), tempPath+".str", username)) {
				System.out.println("originalPath="+originalPath+"   newPath="+newPath);
				jdbc.execute("update "+username+"_files set frontfile='"+newPath+"',realaddress='"+newPath.replace("/", "_")+"' where frontfile='"+originalPath+"'");
				s3client.copyObject(bucketName, originalPath, bucketName, newPath);
				s3client.deleteObject(bucketName, originalPath);
			}
			else {
				jdbc.execute("update "+username+"_files set frontfile='"+newPath+"' where frontfile='"+originalPath+"'");
			}		
		}
		*/
		return this.getTableNames(username);
	}
	
	private String getPathWithoutPostfix(String path) {
		String tempPath=path.replace("/", "_");
		if(tempPath.matches(".*\\.str")) tempPath=tempPath.substring(0,tempPath.length()-4);
		else if(tempPath.matches(".*\\.data")) tempPath=tempPath.substring(0,tempPath.length()-5);
		return tempPath;
	}
	
	/*
	private boolean createPhyscialFile(String path,String username) throws IOException {
		String fileName=path.replace("/", "_");	
		File tempFile=new File(rootPath+"\\"+username+"\\"+fileName);
		return tempFile.createNewFile();
	}
	*/
	/*
	private boolean renamePhysicalFile(String oldFileName,String newFileName, String username) {
		File oldFile=new File(this.getFullPathForSystem(username, oldFileName));
		System.out.println("oldFileName="+oldFileName+"    newFileName="+newFileName);
		if(oldFile.exists()) {
			File newFile=new File(this.getFullPathForSystem(username, newFileName));
			return oldFile.renameTo(newFile);
		}
		return false;
	}
	*/
	/*
	private String getFullPathForSystem(String username,String fileName) {
		return rootPath+"\\"+username+"\\"+fileName;
	}
	*/
	
	public List<Map<String, Object>> getDataForFront(String dataFileName,String offset,String userName){
		
		BigDecimal offsetValue=new BigDecimal(offset);
		if(offsetValue.compareTo(new BigDecimal(0))<1) offsetValue=new BigDecimal(0);
		String requiredLength=String.valueOf(offsetValue.compareTo(new BigDecimal("0"))==0?limitRowNumber*3:limitRowNumber);
		System.out.println("do query "+dataFileName+"  offset="+offset+"   requiredLength="+requiredLength);
		
		String fullCondition=" where id>"+offsetValue.toString()+" order by id asc limit "+requiredLength;
		String sql=this.getDataSQL(dataFileName, userName, fullCondition);
		System.out.println(sql);
		List<Map<String, Object>> dataList=jdbc.queryForList(sql);
		
		return dataList;
	}
	
	public List<Map<String, Object>> getTargetData(String dataFileName, String timestamp,String userName){
		String tableName=jdbc.queryForObject("select get_real_address('"+dataFileName+"'"+(userName==null?"":(",'"+userName+"'"))+")", String.class);
		String id=jdbc.queryForObject("select get_nearest_id_from_datetime('"+timestamp+"','"+tableName+"')", String.class);
		
		List<Map<String,Object>> newDataList=new ArrayList<>();
		Map<String,Object> infoMap=new HashMap<>();
		infoMap.put("targetID", id);
		newDataList.add(infoMap);
		
		newDataList.addAll(jdbc.queryForList("select * from get_target_data('"+tableName+"','"+id+"','"+limitRowNumber*3+"')"));
		return newDataList;
	}
	
	public List<OCHL> getDateForAnalyse(String dataFileName,Timestamp startDateTime,Timestamp endDateTime,int numberPoints,String userName) {
		System.out.println("getDataFroAnalyse");
		if(dataFileName.startsWith("/")) {
			dataFileName=dataFileName.substring(1);
		}
		System.out.println("1  dataFileName="+dataFileName);
		String whereCondition=(startDateTime==null?"":" datetime>=''"+startDateTime.toString()+"'' and")+(endDateTime==null?"":" datetime<=''"+endDateTime.toString()+"''");
		System.out.println("2  whereCondition="+whereCondition);
		
		if(whereCondition.endsWith("'' and")) whereCondition=whereCondition.substring(0, whereCondition.length()-4);
		System.out.println("3  whereCondition="+whereCondition);
		if(!whereCondition.equals("")) whereCondition=" where"+whereCondition;
		System.out.println("4  whereCondition="+whereCondition);
		
		String fullCondition=whereCondition+" order by id asc limit "+numberPoints;
		System.out.println("5  whereCondition="+whereCondition);
		
		System.out.println("dataFileName="+dataFileName+"   numberPoints="+numberPoints+"   fullCondition="+fullCondition);
		
		String sql=getDataSQL(dataFileName,userName,fullCondition);
		return jdbc.query(sql, new OCHLRowMapper());

		//return new ArrayList<OCHL>();
	}
	
	private String getDataSQL(String path,String userName,String condition) {
		return "select * from getData(get_real_address('"+path+"'"+(userName==null?"":(",'"+userName+"'"))+"),'"+condition+"')";
	}
}



