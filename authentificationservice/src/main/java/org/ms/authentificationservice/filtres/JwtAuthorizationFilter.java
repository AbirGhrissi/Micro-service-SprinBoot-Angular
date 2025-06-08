package org.ms.authentificationservice.filtres;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

//Classe de filtre utilisé pour intercepter toute requête demandant une ressource
public class JwtAuthorizationFilter extends OncePerRequestFilter {
	public final String PREFIXE_JWT = "Bearer ";
	public final String CLE_SIGNATURE = "MaClé";

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	        throws ServletException, IOException {

	    // Si la route est /refreshToken, ne pas appliquer le filtre
	    if (request.getServletPath().equals("/refreshToken")) {
	        filterChain.doFilter(request, response);
	    } else {
	        // récupérer le header "Authorization"
	        String authorizationToken = request.getHeader("Authorization");

	        if (authorizationToken != null && authorizationToken.startsWith(PREFIXE_JWT)) {
	            try {
	                String jwt = authorizationToken.substring(PREFIXE_JWT.length());
	                Algorithm algo = Algorithm.HMAC256(CLE_SIGNATURE);
	                JWTVerifier jwtVerifier = JWT.require(algo).build();
	                DecodedJWT decodedJWT = jwtVerifier.verify(jwt);

	                String username = decodedJWT.getSubject();
	                String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
	                Collection<GrantedAuthority> permissions = new ArrayList<>();
	                for (String r : roles) {
	                    permissions.add(new SimpleGrantedAuthority(r));
	                }

	                UsernamePasswordAuthenticationToken authenticationToken =
	                        new UsernamePasswordAuthenticationToken(username, null, permissions);
	                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

	                filterChain.doFilter(request, response);
	            } catch (Exception e) {
	                response.setHeader("error-message", e.getMessage());
	                response.sendError(HttpServletResponse.SC_FORBIDDEN);
	            }
	        } else {
	            filterChain.doFilter(request, response);
	        }
	    }
	}

}
