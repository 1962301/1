package openQuant.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

public class OpenQuantUsernamePasswordAuthFilter extends AbstractAuthenticationProcessingFilter{

	protected OpenQuantUsernamePasswordAuthFilter() {
		super(new AntPathRequestMatcher("/login","POST"));
		// TODO Auto-generated constructor stub
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)throws AuthenticationException, IOException, ServletException {
		String username=request.getParameter("username");
		String password=request.getParameter("password");
		
		UsernamePasswordAuthenticationToken authTocken=new UsernamePasswordAuthenticationToken(username,password);
		
		return this.getAuthenticationManager().authenticate(authTocken);
	}

}

