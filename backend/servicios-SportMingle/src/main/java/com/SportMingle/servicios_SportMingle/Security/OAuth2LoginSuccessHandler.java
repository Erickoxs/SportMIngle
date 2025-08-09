package com.SportMingle.servicios_SportMingle.Security;

import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        try {
            DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
            System.out.println("OAuth2 attributes: " + oauthUser.getAttributes());

            String email = oauthUser.getAttribute("email");
            if (email == null) {
                throw new RuntimeException("Email no proporcionado por Google. Verifica el scope en application.properties");
            }

            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseGet(() -> {
                        Usuario nuevoUsuario = new Usuario();
                        nuevoUsuario.setEmail(email);
                        nuevoUsuario.setNombre(oauthUser.getAttribute("name"));
                        return usuarioRepository.save(nuevoUsuario);
                    });

            String token = jwtUtil.generarToken(usuario);
            System.out.println("Generado token JWT para: " + email);

            String redirectUrl = frontendUrl + "/oauth2/redirect?token=" + token;
            System.out.println("Redirigiendo a: " + redirectUrl);

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error en login OAuth2: " + e.getMessage());
        }
    }
}
