package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TorneoRepository extends JpaRepository<Torneo, Long> {

    // Ejemplos de métodos personalizados si los necesitas:
    List<Torneo> findByDeporteId(Long deporteId);
    List<Torneo> findByEstado(Torneo.EstadoTorneo estado);
}
