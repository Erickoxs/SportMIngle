package com.SportMingle.servicios_SportMingle.Service;
import com.SportMingle.servicios_SportMingle.Model.JugadorPartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.JugadorPartidoInformalRepository;
import com.SportMingle.servicios_SportMingle.dto.JugadorPartidoInformalResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JugadorPartidoInformalService {

    private final JugadorPartidoInformalRepository jugadorPartidoInformalRepository;

    @Autowired
    public JugadorPartidoInformalService(JugadorPartidoInformalRepository jugadorPartidoInformalRepository) {
        this.jugadorPartidoInformalRepository = jugadorPartidoInformalRepository;
    }

    public List<JugadorPartidoInformal> getTodos() {
        return jugadorPartidoInformalRepository.findAll();
    }

    public Optional<JugadorPartidoInformal> getPorId(Long id) {
        return jugadorPartidoInformalRepository.findById(id);
    }

    public List<JugadorPartidoInformalResponse> obtenerPorPartido(Long idPartido) {
        List<JugadorPartidoInformal> jugadores = jugadorPartidoInformalRepository.findByPartidoInformal_IdPartidoInformal(idPartido);
        return jugadores.stream()
                .map(JugadorPartidoInformalResponse::new)
                .toList();
    }


    public List<JugadorPartidoInformal> getPorJugador(Usuario jugador) {
        return jugadorPartidoInformalRepository.findByJugador(jugador);
    }

    public JugadorPartidoInformal crear(JugadorPartidoInformal nuevoRegistro) {
        return jugadorPartidoInformalRepository.save(nuevoRegistro);
    }

    public void eliminar(Long id) {
        jugadorPartidoInformalRepository.deleteById(id);
    }

    public JugadorPartidoInformal actualizar(JugadorPartidoInformal actualizado) {
        return jugadorPartidoInformalRepository.save(actualizado);
    }
}
