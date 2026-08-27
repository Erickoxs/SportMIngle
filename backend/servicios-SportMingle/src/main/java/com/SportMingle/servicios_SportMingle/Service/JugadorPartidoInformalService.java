package com.SportMingle.servicios_SportMingle.Service;
import com.SportMingle.servicios_SportMingle.Model.JugadorPartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.JugadorPartidoInformalRepository;
import com.SportMingle.servicios_SportMingle.dto.JugadorPartidoInformalResponse;
import com.SportMingle.servicios_SportMingle.Repository.PartidoInformalRepository;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JugadorPartidoInformalService {

    private final JugadorPartidoInformalRepository jugadorPartidoInformalRepository;
    private final PartidoInformalRepository partidoInformalRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public JugadorPartidoInformalService(JugadorPartidoInformalRepository jugadorPartidoInformalRepository, PartidoInformalRepository partidoInformalRepository, UsuarioRepository usuarioRepository) {
        this.jugadorPartidoInformalRepository = jugadorPartidoInformalRepository;
        this.partidoInformalRepository = partidoInformalRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<JugadorPartidoInformal> getTodos() {
        return jugadorPartidoInformalRepository.findAll();
    }

    public Optional<JugadorPartidoInformal> getPorId(Long id) {
        return jugadorPartidoInformalRepository.findById(id);
    }

    public List<JugadorPartidoInformalResponse> obtenerPorPartido(Long idPartido) {
        List<JugadorPartidoInformal> jugadores = jugadorPartidoInformalRepository.findByPartidoInformal_IdPartido(idPartido);
        return jugadores.stream()
                .map(JugadorPartidoInformalResponse::new)
                .toList();
    }


    public List<JugadorPartidoInformal> getPorJugador(Usuario jugador) {
        return jugadorPartidoInformalRepository.findByJugador(jugador);
    }

    @Transactional // 1. IMPORTANTE: Mantiene la sesión de Hibernate viva durante todo el método
    public JugadorPartidoInformal crear(JugadorPartidoInformal nuevoRegistro) {

        if (nuevoRegistro.getPartidoInformal() == null || nuevoRegistro.getJugador() == null) {
            throw new RuntimeException("Error: Se debe proporcionar tanto el partido como el jugador.");
        }

        // 2. Extraemos los IDs que el frontend mandó dentro de las estructuras internas
        Long idPartido = nuevoRegistro.getPartidoInformal().getIdPartido();
        Long idUsuario = nuevoRegistro.getJugador().getIdUsuario();

        // 3. Validar si el jugador ya está inscrito en este partido
        if (jugadorPartidoInformalRepository.existsByPartidoInformal_IdPartidoAndJugador_IdUsuario(idPartido, idUsuario)) {
            throw new RuntimeException("Error: El jugador ya está asociado a este partido.");
        }

        // 4. Vamos a Supabase a traer los registros reales y registrados
        PartidoInformal partidoReal = partidoInformalRepository.findById(idPartido)
                .orElseThrow(() -> new RuntimeException("Error: El partido con ID " + idPartido + " no existe."));

        Usuario usuarioReal = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Error: El usuario con ID " + idUsuario + " no existe."));

        // 5. PLANCHAMOS los objetos reales sobre el registro.
        // Esto borra las instancias transitorias que Jackson creó en el aire y le da a Hibernate lo que quiere.
        nuevoRegistro.setPartidoInformal(partidoReal);
        nuevoRegistro.setJugador(usuarioReal);

        // 6. Ahora sí, guardamos limpiamente sin que intente duplicar usuarios o partidos
        return jugadorPartidoInformalRepository.save(nuevoRegistro);
    }

    public void eliminar(Long id) {
        jugadorPartidoInformalRepository.deleteById(id);
    }

    public JugadorPartidoInformal actualizar(JugadorPartidoInformal actualizado) {
        return jugadorPartidoInformalRepository.save(actualizado);
    }
}
