package com.example.demo;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.jdbc.core.RowMapper;

import OCHL.OCHL;

public class OCHLRowMapper implements RowMapper<OCHL>{

	@Override
	public OCHL mapRow(ResultSet rs, int rowNum) throws SQLException {
		OCHL o=new OCHL(rs.getString("open"),rs.getString("close"),rs.getString("high"),rs.getString("low"),rs.getString("vol"),Timestamp.valueOf(rs.getString("datetime")).toLocalDateTime().toString());
		return o;
	}
	
	public static void main(String[] arg) {
		Timestamp time=Timestamp.valueOf("2014-04-04 12:12:12");
		System.out.println(time);
		SimpleDateFormat s=new SimpleDateFormat("yyyy-MM-dd HH:mm");
		SimpleDateFormat s1=new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date d=s.parse("2014-04-04 12:12");
			Date d1=s1.parse("2014-04-04");
			
			
			System.out.println(d.toString());
			System.out.println(d1.toString());
			System.out.println(Timestamp.valueOf(Timestamp.from(d.toInstant()).toLocalDateTime()));
			System.out.println(Timestamp.valueOf(Timestamp.from(d1.toInstant()).toLocalDateTime()));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		String a=null;
		a.toString();
		
	}
}
