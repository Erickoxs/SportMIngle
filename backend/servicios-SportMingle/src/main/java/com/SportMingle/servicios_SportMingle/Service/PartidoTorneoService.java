package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.PartidoTorneo;
import com.SportMingle.servicios_SportMingle.Repository.PartidoTorneoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartidoTorneoService {

    private final PartidoTorneoRepository partidoTorneoRepository;

    @Autowired
    public PartidoTorneoService(PartidoTorneoRepository partidoTorneoRepository) {
        this.partidoTorneoRepository = partidoTorneoRepository;
    }

    // Obtener todos los partidos
    public List<PartidoTorneo> getAllPartidos() {
        return partidoTorneoRepository.findAll();
    }

    public Optional<PartidoTorneo> getPartidoById(Long id) {
        return partidoTorneoRepository.findById(id);
    }

    // Crear un partido
    public PartidoTorneo crearPartido(PartidoTorneo partido) {
        return partidoTorneoRepository.save(partido);
    }

    // Actualizar un partido (asumiendo que el ID está presente en el objeto)
    public PartidoTorneo actualizarPartido(PartidoTorneo partido) {
        if (partido.getIdPartido() == null) {
            throw new IllegalArgumentException("El ID del partido es requerido para actualizar");
        }
        return partidoTorneoRepository.save(partido);
    }

    public void eliminarPartido(Long id) {
        partidoTorneoRepository.deleteById(id);
    }

    // Métodos adicionales, por ejemplo, buscar por torneo
    public List<PartidoTorneo> buscarPorTorneo(Long idTorneo) {
        return partidoTorneoRepository.findByTorneoId(idTorneo);
    }

    public PartidoTorneo actualizarResultados(Long idPartido, Integer resultadoLocal, Integer resultadoVisitante) {
        Optional<PartidoTorneo> partidoOpt = partidoTorneoRepository.findById(idPartido);
        if (partidoOpt.isEmpty()) {
            throw new RuntimeException("Partido no encontrado con id: " + idPartido);
        }

        PartidoTorneo partido = partidoOpt.get();
        partido.setResultadoLocal(resultadoLocal);
        partido.setResultadoVisitante(resultadoVisitante);

        // Opcional: actualizar el estado si quieres marcarlo como "FINALIZADO" u otro estado
        partido.setEstado(PartidoTorneo.EstadoPartido.FINALIZADO);

        return partidoTorneoRepository.save(partido);
    }

}
