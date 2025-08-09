package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {


        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.err.println("[ERROR] Usuario no encontrado: " + email);
                    return new UsernameNotFoundException("Usuario no encontrado");
                });



        String password = usuario.getPasswordHash();
        if (password == null || password.isBlank()) {

            password = "{noop}OAUTH2_USER";
        }



        return User.builder()
                .username(usuario.getEmail())
                .password(password) // Usamos la variable segura, no el valor que podría ser null
                .roles("USER")
                .build();
    }
}
