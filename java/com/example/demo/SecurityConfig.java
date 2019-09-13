package com.example.demo;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	private PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
	private RedirectStrategy redirect=new DefaultRedirectStrategy();
	@Autowired
    Environment env;
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception{
			System.out.println("env="+env.getProperty("spring.ldap.embedded.port"));
			//user name will plugged into {0}
			System.out.println("pass0");
			
			auth.ldapAuthentication().userDnPatterns("uid={0},ou=people")//.userSearchBase("ou=user").userSearchFilter("(uid={0})")
			.groupSearchBase("ou=groups")
			.contextSource()
				.url("ldap://localhost:8389/dc=springframework,dc=org")
				//.ldif("classpath:ldap.ldif")
				//.root("dc=springframework,dc=org")
			.and()
			.passwordCompare()
				//.passwordEncoder(passwordEncoder)
				.passwordAttribute("userPassword");
			System.out.println("pass1");

	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
			http.cors().and().csrf().disable()
			.authorizeRequests().antMatchers("/getTableNames","/hasLogin").permitAll()
			.and().formLogin().defaultSuccessUrl("/hasLogin").failureForwardUrl("/hasLogin")
			
		/*	successHandler(new AuthenticationSuccessHandler() {
	            @Override	//login successfully response
	            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
	            	System.out.println("username="+request.getParameterMap().get("username"));
	            	String username=authentication.getName();
	            	response.setContentType("application/json;charset=utf-8");
	                PrintWriter out = response.getWriter();
	                out.write("{\"status\":\"true\",\"userName\":\""+username+"\"}");
	                out.flush();
	                out.close();
	            }
			}).failureHandler(new AuthenticationFailureHandler() {
                @Override
                public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {
                	response.setContentType("application/json;charset=utf-8");
                    PrintWriter out = response.getWriter();
                    out.write("{\"status\":\"error\",\"msg\":\"error\"}");
                    out.flush();
                    out.close();
                }
            })	*/
			
			.loginProcessingUrl("/Login")
			.and().exceptionHandling().authenticationEntryPoint(new AuthenticationEntryPoint() {
				@Override		//deal with unauthorised anonymous login 
				public void commence(HttpServletRequest request, HttpServletResponse response,AuthenticationException authException) throws IOException, ServletException {
					 	System.out.println("anonymous Login, required uri="+request.getRequestURI());
					 	
					 	response.setHeader("Access-Control-Allow-Origin", "*");
		                response.setHeader("Access-Control-Allow-Headers", "token, Accept, Origin, X-Requested-With, Content-Type, Last-Modified");
	                	response.setContentType("application/json;charset=utf-8");

		                PrintWriter out = response.getWriter();
		                out.write("{\"status\":\"error\",\"msg\":\"匿名\"}");
		                out.flush();
		                out.close();
	                    
	                    
					
				}
				
			}).accessDeniedHandler(new AccessDeniedHandler() {

				@Override	//deal with login user doesn't have enough authority
				public void handle(HttpServletRequest request, HttpServletResponse response,AccessDeniedException accessDeniedException) throws IOException, ServletException {
					System.out.println("failure");
                    response.setHeader("Access-Control-Allow-Origin", "*");
	                response.setHeader("Access-Control-Allow-Headers", "token, Accept, Origin, X-Requested-With, Content-Type, Last-Modified");
                	response.setContentType("application/json;charset=utf-8");
                    PrintWriter out = response.getWriter();
                    out.write("{\"status\":\"error\",\"msg\":\"no rights\"}");
                    out.flush();
                    out.close();
					
				}
				
			})
			.and().logout().logoutUrl("/Logout").
			
	/*		logoutSuccessHandler(new LogoutSuccessHandler() {

				@Override
				public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
						Authentication authentication) throws IOException, ServletException {
					response.setContentType("application/json;charset=utf-8");
                    PrintWriter out = response.getWriter();
                    out.write("{\"status\":\"ok\",\"msg\":\"logout successful\"}");
                    out.flush();
                    out.close();
				}
				
			}).
	*/
			permitAll().logoutSuccessUrl("/hasLogin");
			
			//.antMatchers("/login","/").permitAll()
			//.antMatchers("/**").hasRole("USER");

	}
	
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config=new CorsConfiguration();
		config.setAllowCredentials(true);
		config.setAllowedHeaders(Arrays.asList("*"));
		config.setAllowedMethods(Arrays.asList("GET","POST"));
		config.setAllowedOrigins(Arrays.asList("*"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
		
	}
}
