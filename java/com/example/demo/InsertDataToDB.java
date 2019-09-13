package com.example.demo;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.jdbc.core.JdbcTemplate;

@ComponentScan
@EnableAutoConfiguration
public class InsertDataToDB {
	private JdbcTemplate jdbc;
	@Autowired
	public InsertDataToDB(JdbcTemplate jdbc) {
		this.jdbc=jdbc;
	}
	
	/*
	@PostConstruct
	public void insertData() {
		System.out.println("insert begin");
		try(FileReader fr=new FileReader("c:/3.csv");BufferedReader br=new BufferedReader(fr)){
			String line;
			int i=1;
			while((line=br.readLine())!=null) {
				if(i!=1) {
					String[] t=line.split(",");
					System.out.print(t.length);
					jdbc.update("insert into csv1(datatime,trade_price,volumn,tick_type,condition) values(?,?,?,?,?)",
						Timestamp.valueOf(LocalDateTime.parse(t[0])),
						Double.parseDouble(t[1]),
						Integer.parseInt(t[2]),
						t[3],
						t[4]);
				}
				i++;
			}
			
			
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	*/
	
	
	public static void main(String[] args) {
		 SpringApplication.run(InsertDataToDB.class, args);
		 
	}
}



