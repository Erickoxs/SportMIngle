package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.InscripcionTorneo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InscripcionTorneoRepository extends JpaRepository<InscripcionTorneo, Long> {

    // Buscar inscripciones por torneo
    List<InscripcionTorneo> findByTorneoId(Long idTorneo);

    // Buscar inscripciones por club
    List<InscripcionTorneo> findByClubesId(Long idClub);

    // Buscar inscripciones por torneo y club (por ejemplo para validar inscripción única)
    List<InscripcionTorneo> findByTorneoIdAndClubesId(Long idTorneo, Long idClub);
}
