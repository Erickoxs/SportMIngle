package com.SportMingle.servicios_SportMingle.Repository;
import com.SportMingle.servicios_SportMingle.Model.JugadorPartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JugadorPartidoInformalRepository extends JpaRepository<JugadorPartidoInformal, Long> {

    // Obtener todas las inscripciones a un partido específico
    List<JugadorPartidoInformal> findByPartidoInformal(PartidoInformal partidoInformal);

    // Obtener todas las inscripciones de un jugador específico
    List<JugadorPartidoInformal> findByJugador(Usuario jugador);

    List<JugadorPartidoInformal> findByPartidoInformal_IdPartido(Long idPartido);





}
