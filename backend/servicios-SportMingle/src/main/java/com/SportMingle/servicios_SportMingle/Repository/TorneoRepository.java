package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TorneoRepository extends JpaRepository<Torneo, Long> {

    // Ejemplos de métodos personalizados si los necesitas:
    List<Torneo> findByDeporteId(Long deporteId);
    List<Torneo> findByEstado(Torneo.EstadoTorneo estado);

    @Query(value = """
    SELECT t.*
    FROM torneos t
    JOIN deportes d ON t.id_deporte = d.id_deporte
    WHERE d.nombre = :deporte
    AND ST_DWithin(t.ubicacion, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :distancia)
""", nativeQuery = true)
    List<Torneo> findTorneosCercanosPorDeporte(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("distancia") double distancia,
            @Param("deporte") String deporte
    );

}
