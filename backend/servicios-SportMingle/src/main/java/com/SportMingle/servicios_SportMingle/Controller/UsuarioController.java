package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Service.UsuarioService;
import com.SportMingle.servicios_SportMingle.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UsuarioController(UsuarioService usuarioService, AuthenticationManager authenticationManager) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }

    @PostMapping("/login")

    public String login(@RequestBody LoginRequest loginRequest) {
        try {

            System.out.println("Email: " + loginRequest.getEmail());
            System.out.println("Contrasena: " + loginRequest.getPasswordHash());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPasswordHash()
                    )
            );

            // Aquí normalmente generarías y devolverías un JWT
            return "Login exitoso para el usuario: " + loginRequest.getEmail();
        } catch (AuthenticationException ex) {
            return "Error de autenticación: email o contraseña incorrectos";
        }
    }
}
