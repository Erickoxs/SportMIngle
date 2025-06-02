package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.MiembroClub;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Model.Clubes;
import com.SportMingle.servicios_SportMingle.Repository.MiembroRepository;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import com.SportMingle.servicios_SportMingle.Repository.ClubesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MiembroClubService {

    private final MiembroRepository miembroRepository;
    private final UsuarioRepository usuarioRepository;
    private final ClubesRepository clubesRepository;

    public MiembroClubService(MiembroRepository miembroRepository,
                              UsuarioRepository usuarioRepository,
                              ClubesRepository clubesRepository) {
        this.miembroRepository = miembroRepository;
        this.usuarioRepository = usuarioRepository;
        this.clubesRepository = clubesRepository;
    }

    public List<MiembroClub> obtenerPorClub(Long idClub) {
        return miembroRepository.findByClubId(idClub);
    }

    public List<MiembroClub> obtenerPorDeportista(Long idUsuario) {
        return miembroRepository.findByDeportistaIdUsuario(idUsuario);
    }

    public boolean esMiembroActivo(Long idUsuario, Long idClub) {
        return miembroRepository.existsByDeportistaIdUsuarioAndClubIdAndActivoTrue(idUsuario, idClub);
    }

    public MiembroClub guardarMiembro(MiembroClub miembroClub) {
        // Cargar usuario completo para evitar problemas
        Usuario usuario = usuarioRepository.findById(miembroClub.getDeportista().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        miembroClub.setDeportista(usuario);

        Clubes club = clubesRepository.findById(miembroClub.getClub().getId())
                .orElseThrow(() -> new RuntimeException("Club no encontrado"));
        miembroClub.setClub(club);

        return miembroRepository.save(miembroClub);
    }

    public void eliminarMiembro(Long id) {
        miembroRepository.deleteById(id);
    }
}
