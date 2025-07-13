package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import com.SportMingle.servicios_SportMingle.Model.MiembroClub;
import com.SportMingle.servicios_SportMingle.Model.SolicitudClub;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.MiembroRepository;
import com.SportMingle.servicios_SportMingle.Repository.SolicitudClubRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitudClubService {
    private final SolicitudClubRepository repo;
    private final MiembroRepository miembroRepo;

    public SolicitudClubService(SolicitudClubRepository repo, MiembroRepository miembroRepo) {
        this.repo = repo;
        this.miembroRepo = miembroRepo;
    }

    public void solicitarIngreso(Long idUsuario, Long idClub) {
        // validaciones
        SolicitudClub solicitud = new SolicitudClub();

        Usuario usuario = new Usuario();
        usuario.setIdUsuario(idUsuario);

        Clubes club = new Clubes();
        club.setId(idClub);

        solicitud.setUsuario(usuario);
        solicitud.setClub(club);
        solicitud.setEstado(SolicitudClub.EstadoSolicitud.PENDIENTE);
        solicitud.setEsInvitacion(false);

        repo.save(solicitud);
    }


    public void invitarUsuario(Long idClub, Long idUsuario) {
        SolicitudClub invitacion = new SolicitudClub();

        Usuario usuario = new Usuario();
        usuario.setIdUsuario(idUsuario);

        Clubes club = new Clubes();
        club.setId(idClub);

        invitacion.setUsuario(usuario);
        invitacion.setClub(club);
        invitacion.setEstado(SolicitudClub.EstadoSolicitud.PENDIENTE);
        invitacion.setEsInvitacion(true);

        repo.save(invitacion);
    }


    public void aceptar(Long idSolicitud) {
        SolicitudClub solicitud = repo.findById(idSolicitud).orElseThrow();
        solicitud.setEstado(SolicitudClub.EstadoSolicitud.ACEPTADA);
        repo.save(solicitud);

        // Agregar a miembro del club
        MiembroClub miembro = new MiembroClub();
        miembro.setDeportista(solicitud.getUsuario());
        miembro.setClub(solicitud.getClub());
        miembro.setFechaUnion(LocalDate.now());
        miembroRepo.save(miembro);
    }

    public void rechazar(Long idSolicitud) {
        SolicitudClub solicitud = repo.findById(idSolicitud).orElseThrow();
        solicitud.setEstado(SolicitudClub.EstadoSolicitud.RECHAZADA);
        repo.save(solicitud);
    }

    public List<SolicitudClub> obtenerSolicitudesPendientesPorClub(Long idClub) {
        return repo.findByClubIdAndEstado(idClub, SolicitudClub.EstadoSolicitud.PENDIENTE);
    }
}
