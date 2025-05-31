package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.ClubesRepository;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClubesService {

    @Autowired
    private UsuarioRepository usuarioRepository; // asegúrate de tener este repo

    @Autowired
    private ClubesRepository clubesRepository;

    public Clubes crearClub(Clubes club) {
        System.out.println("Id 1 :" + club.getAdministrador() );
        if (club.getAdministrador() == null || club.getAdministrador() == null) {
            throw new IllegalArgumentException("Debes proporcionar el administrador con un ID válido.");
        }

        Long adminId = club.getAdministrador().getIdUsuario();

        Usuario adminPersistido = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        club.setAdministrador(adminPersistido);
        return clubesRepository.save(club);
    }

}
