package br.edu.ifpe.recife.labgeo.sigabem.service;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import br.edu.ifpe.recife.labgeo.sigabem.model.Notification;
import br.edu.ifpe.recife.labgeo.sigabem.util.Constants;

@Service
public class NotificationService {

	public String sendNotification(Notification notification) {
		
		RestTemplate restTemplate = new RestTemplate();
		String response = "sem resposta";
		
		try {
			URI uri = new URI("https://onesignal.com/api/v1/notifications");
			
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
			headers.setBasicAuth(Constants.REST_API_KEY);
			
			String strJsonBody = "{"
                    +   "\"app_id\": \"" + Constants.APP_ID + "\","
                    +   "\"included_segments\": [\"All\"],"
                    +   "\"data\": {\"foo\": \"bar\"},"
                    +   "\"headings\": { \"en\": \"" + notification.getTitle() + "\" },"
                    +   "\"small_icon\": \"icon\","
                    +   "\"android_accent_color\": \"29d8a1a8\","
                    +   "\"large_icon\": \"icon\","
                    +   "\"contents\": {\"en\": \"" + notification.getContents() + "\"}"
                    + "}";
			
			HttpEntity<String> request = new HttpEntity<String>(strJsonBody, headers);
			
			response = restTemplate.postForObject(uri, request, String.class);
			
		} catch (URISyntaxException e) {
			e.printStackTrace();
			response = e.getMessage();
		} catch (HttpStatusCodeException ex) {
			ex.printStackTrace();
			response = ex.getResponseBodyAsString();
		}
	
		System.out.println("---------------------------------------------------------------------------");
		System.out.println("response: " + response);
		System.out.println("---------------------------------------------------------------------------");
		
		return response;
	}
}
