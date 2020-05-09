package br.edu.ifpe.recife.labgeo.sigabem.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.util.WebUtils;

public class CookieUtil {
	/**
	 * Creates a cookie object to an determined response. 
	 * It's possible to include it's path, domain, security, name and value. 
	 * 
	 * @param httpServletResponse The response whose will receive the new Cookie.
	 * @param name The cookie's name.
	 * @param value The cookie's value.
	 * @param secure True if you don't want the browser to send it to the server if connection is unencrypted ( non HTTPS ).
	 * @param maxAge Cookie's life time.
	 * @param domain The domain within which the cookie should be presented.
	 */
	public static void create(HttpServletResponse httpServletResponse, String name, String value, Boolean secure, Integer maxAge, String domain) {
        
		Cookie cookie = new Cookie(name, value);
        
        cookie.setSecure(secure);
        cookie.setHttpOnly(true);
//        cookie.setMaxAge(maxAge);
        cookie.setMaxAge(60 * 60);
//        cookie.setDomain(domain);
        cookie.setPath("/");
        
        httpServletResponse.addCookie(cookie);
    }

	/**
	 * Deletes the cookie with the given name.
	 * 
	 * @param httpServletResponse The response with the cookie.
	 * @param name Cookie's name which will be deleted.
	 */
    public static void clear(HttpServletResponse httpServletResponse, String name) {
        
    	Cookie cookie = new Cookie(name, null);
        
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        
        httpServletResponse.addCookie(cookie);
    }

    /**
     * Gets a cookie value by it's name.
     * 
     * @param httpServletRequest The response with the cookie.
     * @param name Name of the cookie.
     * @return Returns a String with the cookie's value.
     */
    public static String getValue(HttpServletRequest httpServletRequest, String name) {
        Cookie cookie = WebUtils.getCookie(httpServletRequest, name);
        
        return cookie != null ? cookie.getValue() : null;
    }
}
