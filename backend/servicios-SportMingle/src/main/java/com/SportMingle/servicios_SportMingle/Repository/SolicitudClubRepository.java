package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.SolicitudClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudClubRepository extends JpaRepository<SolicitudClub, Long> {
    List<SolicitudClub> findByClubIdAndEstado(Long idClub, SolicitudClub.EstadoSolicitud estado);
    List<SolicitudClub> findByUsuario_IdUsuarioAndEstado(Long idUsuario, SolicitudClub.EstadoSolicitud estado);

    boolean existsByUsuario_IdUsuarioAndClub_IdAndEstado(Long idUsuario, Long idClub, SolicitudClub.EstadoSolicitud estado);
}
