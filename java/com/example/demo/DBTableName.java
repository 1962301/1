package com.example.demo;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

public class DBTableName {
	private String tableName;
	private String tableType;
	
	public void setTableName(String tableName) {
		this.tableName=tableName;
	}
	public void setTableType(String tableType) {
		this.tableType=tableType;
	}
	public String getTableName() {
		return this.tableName;
	}
	public String getTableType() {
		return this.tableType;
	}
	@Override
	public String toString() {
		return "tableName="+tableName+"; tableCatalog="+tableType;
	}
}

class DBTableNameMapper implements RowMapper<DBTableName>{

	@Override
	public DBTableName mapRow(ResultSet rs, int rowNum) throws SQLException {
		DBTableName a=new DBTableName();
		a.setTableName(rs.getString("file"));
		a.setTableType(rs.getString("type"));
		return a;
	}
	
}
