package br.edu.ifpe.recife.labgeo.sigabem.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import br.edu.ifpe.recife.labgeo.sigabem.model.Notification;
import br.edu.ifpe.recife.labgeo.sigabem.model.User;
import br.edu.ifpe.recife.labgeo.sigabem.util.Constants;

@Service
public class NotificationService {
	
	@Autowired
	UserService userService;

	public String sendNotification(Notification notification) {
		
		RestTemplate restTemplate = new RestTemplate();
		String response = "sem resposta";
		
		List<User> users = userService.findUsers(notification.getRemittee());
		
		String playerIds = "";
		for(int i = 0; i < users.size(); i++) {
			playerIds += users.get(i).getUser_notification_id() + ",";
		}
		
		try {
			URI uri = new URI("https://onesignal.com/api/v1/notifications");
			
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
			headers.setBasicAuth(Constants.REST_API_KEY);
			
			String strJsonBody = "{"
                    +   "\"app_id\": \"" + Constants.APP_ID + "\","
                    +   "\"included_segments\": [\"All\"],"
                    +   "\"data\": {\"tipo\": \"" + notification.getNotificationType() + "\"},"
                    +   "\"headings\": { \"en\": \"" + notification.getTitle() + "\" },"
                    +   "\"small_icon\": \"icon\","
                    +   "\"android_accent_color\": \"29d8a1a8\","
                    +   "\"large_icon\": \"icon\","
                    +   "\"contents\": {\"en\": \"" + notification.getContents() + "\"},"
                    +   "\"include_player_ids\": [\"" + playerIds + "\"]"
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
		
		return response;
	}
}
