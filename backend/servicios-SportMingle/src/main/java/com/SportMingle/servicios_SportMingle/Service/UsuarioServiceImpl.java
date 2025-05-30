package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import com.SportMingle.servicios_SportMingle.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario crearUsuario(Usuario usuario) {
        // Hashear la contraseña antes de guardar
        String passwordHashed = passwordEncoder.encode(usuario.getPasswordHash());
        usuario.setPasswordHash(passwordHashed);
        return usuarioRepository.save(usuario);
    }
}
