package br.edu.ifpe.recife.labgeo.sigabem.controller;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import br.edu.ifpe.recife.labgeo.sigabem.model.Notification;
import br.edu.ifpe.recife.labgeo.sigabem.service.NotificationService;
import br.edu.ifpe.recife.labgeo.sigabem.util.Constants;
import br.edu.ifpe.recife.labgeo.sigabem.util.CookieUtil;

@Controller
public class NotificationController {

	@Autowired
	NotificationService notificationService;
	
	@Autowired
	private UserController userController;
	
	@PostMapping("/notificacao/enviar")
	public ModelAndView sendNotification(@Valid Notification notification, HttpServletRequest httpServletRequest) {
		String token = CookieUtil.getValue(httpServletRequest, Constants.JWT_TOKEN_COOKIE_NAME);

		String response = notificationService.sendNotification(notification);
		
		return sendNotification(httpServletRequest).addObject("response", response);
	}
	
	@GetMapping("/notificacao/enviar")
	public ModelAndView sendNotification(HttpServletRequest httpServletRequest) {
		String token = CookieUtil.getValue(httpServletRequest, Constants.JWT_TOKEN_COOKIE_NAME);
		
		ModelAndView mv = new ModelAndView("notificar");
		mv.addObject("notification", new Notification());
		
		return mv;
	}
}
