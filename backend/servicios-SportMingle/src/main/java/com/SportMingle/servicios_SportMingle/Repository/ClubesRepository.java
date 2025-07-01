package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubesRepository extends JpaRepository<Clubes, Long> {
    // List<Clubes> findByDeporte(String deporte);

    @Query(value = """
    SELECT c.*
    FROM clubes c
    JOIN deportes d ON c.id_deporte = d.id_deporte
    WHERE d.nombre = :deporte
    AND ST_DWithin(c.ubicacion, ST_MakePoint(:lng, :lat)::geography, :distancia)
""", nativeQuery = true)
    List<Clubes> buscarClubesCercanosPorDeporte(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("distancia") double distanciaEnMetros,
            @Param("deporte") String deporte
    );
    @Query("SELECT c FROM Clubes c JOIN MiembroClub mc ON mc.club.id = c.id " +
            "WHERE mc.deportista.id = :idOrganizador AND mc.activo = true")
    Optional<Clubes> obtenerClubPorOrganizador(@Param("idOrganizador") Long idOrganizador);



}
