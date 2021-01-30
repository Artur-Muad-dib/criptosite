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

    @GetMapping("/historico")
    public String showHistorico() {
        return "historico/historico";
    }

    @GetMapping("/reset-password")
    public String showMudarSenha() {
        return "changepassword/changepassword";
    }

    @GetMapping("/linhas-favoritadas")
    public String showParadasFavoritadas() {
        return "linhas-favoritadas/linhas-favoritadas";
    }
}
