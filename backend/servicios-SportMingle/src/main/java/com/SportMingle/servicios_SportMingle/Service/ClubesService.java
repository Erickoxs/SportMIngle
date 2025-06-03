package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Model.Deporte;
import com.SportMingle.servicios_SportMingle.Repository.ClubesRepository;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import com.SportMingle.servicios_SportMingle.Repository.DeporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClubesService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClubesRepository clubesRepository;

    @Autowired
    private DeporteRepository deporteRepository;

    public Clubes crearClub(Clubes club) {
        System.out.println("Club recibido: " + club);
        if (club.getAdministrador() == null) {
            System.out.println("Error: Administrador es null");
            throw new IllegalArgumentException("Administrador no puede ser null");
        }
        System.out.println("Administrador recibido: " + club.getAdministrador());
        if (club.getAdministrador() == null) {
            System.out.println("Error: Id del administrador es null");
            throw new IllegalArgumentException("El id del administrador no puede ser null");
        }
        System.out.println("Id administrador recibido: " + club.getAdministrador().getIdUsuario());

        if (club.getDeporte() == null) {
            System.out.println("Error: Deporte es null");
            throw new IllegalArgumentException("Deporte no puede ser null");
        }
        System.out.println("Deporte recibido: " + club.getDeporte());

        if (club.getDeporte().getId() == null) {
            System.out.println("Error: Id del deporte es null");
            throw new IllegalArgumentException("El id del deporte no puede ser null");
        }
        System.out.println("Id deporte recibido: " + club.getDeporte().getId());

        Long adminId = club.getAdministrador().getIdUsuario();
        Usuario adminPersistido = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
        System.out.println("Administrador persistido encontrado: " + adminPersistido);
        club.setAdministrador(adminPersistido);

        Long deporteId = club.getDeporte().getId();
        Deporte deportePersistido = deporteRepository.findById(deporteId)
                .orElseThrow(() -> new RuntimeException("Deporte no encontrado"));
        System.out.println("Deporte persistido encontrado: " + deportePersistido);
        club.setDeporte(deportePersistido);

        Clubes clubGuardado = clubesRepository.save(club);
        System.out.println("Club guardado: " + clubGuardado);

        return clubGuardado;
    }

    public boolean existePorId(Long id) {
        return clubesRepository.existsById(id);
    }


}
