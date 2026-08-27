package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.MiembroClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MiembroRepository extends JpaRepository<MiembroClub, Long> {

    // Buscar miembros por club
    List<MiembroClub> findByClubId(Long idClub);

    // Buscar miembros por deportista
    List<MiembroClub> findByDeportistaIdUsuario(Long idUsuario);

    // Buscar por club y rol (por ejemplo, para obtener al capitán)
    List<MiembroClub> findByClubIdAndRol(Long idClub, MiembroClub.Rol rol);

    // Buscar si un usuario es miembro de un club
    boolean existsByDeportistaIdUsuarioAndClubId(Long idUsuario, Long idClub);

    // Buscar si un usuario es miembro activo de un club
    boolean existsByDeportistaIdUsuarioAndClubIdAndActivoTrue(Long idUsuario, Long idClub);

}
