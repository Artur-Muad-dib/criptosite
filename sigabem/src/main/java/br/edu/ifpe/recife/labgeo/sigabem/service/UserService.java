package br.edu.ifpe.recife.labgeo.sigabem.service;

import java.net.ConnectException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.TimeoutException;

import javax.naming.TimeLimitExceededException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;

import br.edu.ifpe.recife.labgeo.sigabem.model.User;
import br.edu.ifpe.recife.labgeo.sigabem.util.Constants;
import br.edu.ifpe.recife.labgeo.sigabem.util.CookieUtil;

@Service
public class UserService {

	public String saveUser(User user) {

		RestTemplate restTemplate = new RestTemplate();
		Gson gson = new Gson();
		
		String response = "sem resposta";
		
		try {
			URI uri = new URI("http://sigabem-env-1.f2p2pcstzh.us-east-2.elasticbeanstalk.com/users");
			
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			
			HttpEntity<String> request = new HttpEntity<String>(gson.toJson(user), headers);
			
			response = restTemplate.postForObject(uri, request, String.class);
			
		} catch (URISyntaxException e) {
			e.printStackTrace();
			response = e.getMessage();
		} catch (HttpStatusCodeException ex) {
			ex.printStackTrace();
			response = ex.getResponseBodyAsString();
		}
		
		return response;
	}

	public String authenticate(User user, HttpServletResponse httpServletResponse) {
		
		RestTemplate restTemplate = new RestTemplate();
		Gson gson = new Gson();
		String resposta = null;
		
		try {
			URI uri = new URI("http://sigabem-env-1.f2p2pcstzh.us-east-2.elasticbeanstalk.com/users/login");
			
			HttpEntity<String> request = new HttpEntity<String>(gson.toJson(user), new HttpHeaders());
			
			String token = null;
			token = restTemplate.postForObject(uri, request, String.class);
			
			 // Se o token existir...
			if (token != null) {
				
				token = token.replaceAll("\\s+", "_");
				
				// Cria um cookie com o token recebido após a autenticação do usuário
				CookieUtil.create(httpServletResponse, Constants.JWT_TOKEN_COOKIE_NAME, token, false, -1, "http://127.0.0.1:8080/"); 
				resposta = "sucesso";
			}
			
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		
		return resposta;
	}
	
	public void logoff() {
		RestTemplate restTemplate = new RestTemplate();
		
		try {
			URI uri = new URI("http://sigabem-env-1.f2p2pcstzh.us-east-2.elasticbeanstalk.com/users/me/logout");
		
			HttpHeaders headers = new HttpHeaders();
			
			HttpEntity<String> request = new HttpEntity<String>("", headers);
			
			restTemplate.postForObject(uri, request, String.class);
			
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
	}

	public String showMeToken() {
		RestTemplate restTemplate = new RestTemplate();
		String response = "";
		
		try {
			URI uri = new URI("http://sigabem-env-1.f2p2pcstzh.us-east-2.elasticbeanstalk.com/users/me");
		
			HttpHeaders headers = new HttpHeaders();
			
			HttpEntity<String> request = new HttpEntity<String>("", headers);
			
			response = restTemplate.postForObject(uri, request, String.class);
			
		} catch (URISyntaxException e) {
			e.printStackTrace();
			response = e.getMessage();
		}
		
		return response;
	}
	
	public HttpEntity<String> checkCookieToken(HttpServletRequest request) {
		String token = CookieUtil.getValue(request, Constants.JWT_TOKEN_COOKIE_NAME);
		HttpEntity<String> entity = null;
		
		if(token != null){
			HttpHeaders httpHeaders = new HttpHeaders();
			
			token = token.replaceFirst("_", " ");
			httpHeaders.add("Authorization", token);	
			httpHeaders.setBearerAuth(token);

			entity = new HttpEntity<String>("parameters", httpHeaders);
		}
		
		return entity;
	}
}
