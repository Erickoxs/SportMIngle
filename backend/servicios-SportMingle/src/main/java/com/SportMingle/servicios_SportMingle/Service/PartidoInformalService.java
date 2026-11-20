package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.JugadorPartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Repository.JugadorPartidoInformalRepository;
import com.SportMingle.servicios_SportMingle.Repository.PartidoInformalRepository;
import com.SportMingle.servicios_SportMingle.dto.MiPartidoResponse;
import com.SportMingle.servicios_SportMingle.dto.PartidoInformalRequest;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PartidoInformalService {

    private final PartidoInformalRepository partidoInformalRepository;

    @Autowired
    public PartidoInformalService(PartidoInformalRepository partidoInformalRepository) {
        this.partidoInformalRepository = partidoInformalRepository;
    }
    @Autowired
    private GeometryFactory geometryFactory;

    @Autowired
    private UsuarioServiceImpl usuarioService;

    @Autowired
    private DeporteService deporteService;

    @Autowired
    private JugadorPartidoInformalRepository jugadorPartidoInformalRepository;

    public List<PartidoInformal> getAllPartidos() {
        return partidoInformalRepository.findByFechaHoraGreaterThanEqualOrderByFechaHoraAsc(LocalDateTime.now());
    }

    public Optional<PartidoInformal> getPartidoById(Long id) {
        return partidoInformalRepository.findById(id);
    }

    public PartidoInformal crearPartidoDesdeRequest(PartidoInformalRequest request) {
        Point point = geometryFactory.createPoint(new Coordinate(request.getLon(), request.getLat()));
        point.setSRID(4326);

        PartidoInformal partido = new PartidoInformal();
        partido.setOrganizador(usuarioService.findById(request.getIdOrganizador()));
        partido.setDeporte(deporteService.obtenerDeportePorId(request.getIdDeporte()));
        partido.setFechaHora(request.getFechaHora());
        partido.setUbicacion(point);
        partido.setMaxJugadores(request.getMaxJugadores());

        // Enum conversion
        partido.setNivelRequerido(
                PartidoInformal.NivelRequerido.valueOf(request.getNivelRequerido().toUpperCase())
        );

        partido.setDescripcion(request.getDescripcion());

        return partidoInformalRepository.save(partido);
    }

    public PartidoInformal actualizarPartido(PartidoInformal partido) {
        if (partido.getIdPartido() == null) {
            throw new IllegalArgumentException("El ID del partido informal es requerido para actualizar");
        }
        return partidoInformalRepository.save(partido);
    }

    public void eliminarPartido(Long id) {
        partidoInformalRepository.deleteById(id);
    }

    public List<PartidoInformal> buscarPorDeporte(Long idDeporte) {
        return partidoInformalRepository.findByDeporteIdAndFechaHoraGreaterThanEqualOrderByFechaHoraAsc(idDeporte, LocalDateTime.now());
    }

    public List<PartidoInformal> buscarPorNivelRequerido(String nivelRequerido) {
        return partidoInformalRepository.findByNivelRequerido(nivelRequerido);
    }


    public List<PartidoInformal> buscarPorDeporteYNivel(Long idDeporte, String nivelRequerido) {
        return partidoInformalRepository.findByDeporteIdAndNivelRequerido(idDeporte, nivelRequerido);
    }

    public List<PartidoInformal> buscarCercanos(double lat, double lon, String deporte, double distancia) {
        Point ubicacion = geometryFactory.createPoint(new Coordinate(lon, lat)); // lon, lat (orden importante)
        ubicacion.setSRID(4326);
        return partidoInformalRepository.buscarCercanos(ubicacion, deporte, distancia);
    }

    public boolean existePorId(Long id) {
        return partidoInformalRepository.existsById(id);
    }

    public List<MiPartidoResponse> obtenerMisPartidos(Long idUsuario) {
        Map<Long, MiPartidoResponse> misPartidosMap = new LinkedHashMap<>();

        // 1. Partidos a los que el usuario se inscribió
        List<JugadorPartidoInformal> inscripciones = jugadorPartidoInformalRepository.findInscripcionesDeUsuario(idUsuario);
        for (JugadorPartidoInformal j : inscripciones) {
            PartidoInformal p = j.getPartidoInformal();
            if (p != null) {
                misPartidosMap.put(p.getIdPartido(), new MiPartidoResponse(p, idUsuario, j.getIdInscripcion()));
            }
        }

        // 2. Partidos que el usuario organizó
        List<PartidoInformal> organizados = partidoInformalRepository.findOrganizadosPorUsuario(idUsuario);
        for (PartidoInformal p : organizados) {
            if (p != null && !misPartidosMap.containsKey(p.getIdPartido())) {
                misPartidosMap.put(p.getIdPartido(), new MiPartidoResponse(p, idUsuario, null));
            }
        }

        // 3. Devolver lista ordenada por fechaHora DESC (los más recientes primero)
        return misPartidosMap.values().stream()
                .sorted((a, b) -> {
                    if (a.getFechaHora() == null || b.getFechaHora() == null) return 0;
                    return b.getFechaHora().compareTo(a.getFechaHora());
                })
                .toList();
    }
}

