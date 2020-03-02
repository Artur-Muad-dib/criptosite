package br.edu.ifpe.recife.labgeo.sigabem.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;

import br.edu.ifpe.recife.labgeo.sigabem.model.Response;
import br.edu.ifpe.recife.labgeo.sigabem.model.User;
import br.edu.ifpe.recife.labgeo.sigabem.service.UserService;

@CrossOrigin
@RestController
public class UserController {
	
	@Autowired
	UserService userService;
	
	@Autowired
	Gson gson;
	
	@Autowired
	WebController webController;
	
	@PostMapping("/usuario/cadastro")
	public ModelAndView saveUser(@Valid User user) {
		String response = userService.saveUser(user);
		Response responseObject = gson.fromJson(response, Response.class);
		
		if(responseObject.getMessage() != null) {
			return save().addObject("message", responseObject.getMessage());
		}
			
		return save().addObject("error", responseObject.getError());
	}
	
	@GetMapping("/usuario/cadastro")
	public ModelAndView save() {
		ModelAndView mv = new ModelAndView("inserir");
		mv.addObject("user", new User());
		
		return mv;
	}
	
	@PostMapping("/usuario/login")
	public ModelAndView authenticate(@Valid User user, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
//		String response = userService.authenticate(user, httpServletResponse);
//		
//		return authenticate().addObject("response", response);
		
		return webController.showMap(httpServletRequest);
	}
	
	@GetMapping("/")
	public ModelAndView authenticate() {
		ModelAndView mv = new ModelAndView("login");
		mv.addObject("user", new User());
		
		return mv;
	}

}
