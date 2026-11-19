package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PartidoInformalRepository extends JpaRepository<PartidoInformal, Long> {

    List<PartidoInformal> findByOrganizadorIdUsuario(Long idUsuario);

    List<PartidoInformal> findByDeporteId(Long idDeporte);

    List<PartidoInformal> findByNivelRequerido(String nivelRequerido);

    List<PartidoInformal> findByDeporteIdAndNivelRequerido(Long idDeporte, String nivelRequerido);

    // Métodos para filtrar solo partidos futuros
    List<PartidoInformal> findByFechaHoraGreaterThanEqualOrderByFechaHoraAsc(LocalDateTime ahora);

    List<PartidoInformal> findByDeporteIdAndFechaHoraGreaterThanEqualOrderByFechaHoraAsc(Long idDeporte, LocalDateTime ahora);

    @Query(value = """
    SELECT p.* FROM partidos p
    JOIN deportes d ON p.id_deporte = d.id_deporte
    WHERE d.nombre = :nombreDeporte
    AND ST_DWithin(p.ubicacion, :ubicacion, :distancia)
    AND p.fecha_hora >= CURRENT_TIMESTAMP
    ORDER BY p.fecha_hora ASC
""", nativeQuery = true)
    List<PartidoInformal> buscarCercanos(
            @Param("ubicacion") Point ubicacion,
            @Param("nombreDeporte") String nombreDeporte,
            @Param("distancia") double distancia
    );

}
