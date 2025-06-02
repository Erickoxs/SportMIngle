package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.PartidoTorneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PartidoTorneoRepository extends JpaRepository<PartidoTorneo, Long> {

    // Ejemplo: buscar partidos por torneo
    List<PartidoTorneo> findByTorneoId(Long idTorneo);

    // Ejemplo: buscar partidos por estado
    List<PartidoTorneo> findByEstado(PartidoTorneo.EstadoPartido estado);

    // Ejemplo: buscar partidos por fase del torneo
    List<PartidoTorneo> findByFaseTorneo(String faseTorneo);

    // Otros métodos personalizados que necesites...
}
