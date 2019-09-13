package com.example.demo;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:application.properties")
class DataSourceConfig{
	@Autowired
    Environment env;
	
	@Bean
	@ConfigurationProperties(prefix = "spring.datasource")
	public DataSource getDataSource() {
		System.out.println("env="+env.toString());
		System.out.println("env="+env.getProperty("spring.datasource.username"));
		System.out.println("env="+env.getProperty("spring.datasource.haha"));
		System.out.println("env="+env.getProperty("spring.spring.resources.static-locations"));
		
		DataSourceBuilder<?> dsb=DataSourceBuilder.create();
		//dsb.url("jdbc:postgresql://localhost:5432/postgres").username("postgres").password("woaiwo1623").driverClassName("org.postgresql.Driver");
		return dsb.build();
	}
}
