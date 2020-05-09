package br.edu.ifpe.recife.labgeo.sigabem.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import br.edu.ifpe.recife.labgeo.sigabem.util.Constants;
import br.edu.ifpe.recife.labgeo.sigabem.util.CookieUtil;

@Controller
public class WebController {
	
	@Autowired
	UserController userController;
	
	@GetMapping("/mapa")
    public ModelAndView showMap(HttpServletRequest httpServletRequest) {
		String token = CookieUtil.getValue(httpServletRequest, Constants.JWT_TOKEN_COOKIE_NAME);
		
		if(token == null) {
//			return userController.authenticate();
		}
		
		ModelAndView mv = new ModelAndView("mapa");
		
        return mv;
    }
	
	@GetMapping("/")
	public String showLoginRoot() {
		return showLogin();
	}
	
	@GetMapping("/denied")
    public String showDenied() {
        return "errors/accessDenied";
    }
	
	@GetMapping("/login")
    public String showLogin() {
        return "login/sigaBemLogin";
    }
	
	@GetMapping("/gerenciador")
    public String showGerenciador() {
        return "gerenciador/gerenciador";
    }
	
	@GetMapping("/mapManager")
    public String showMapManager() {
        return "mapManager/mapManager";
    }
	
	@GetMapping("/notificacoes")
    public String showNotificacoes() {
        return "notificacoes/notificacoes2";
    }
	
	@GetMapping("/reclamacoes")
    public String showReclamacoes() {
        return "reclamacoes/reclamacoes";
    }
}
