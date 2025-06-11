package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Torneo;
import com.SportMingle.servicios_SportMingle.Repository.TorneoRepository;
import com.SportMingle.servicios_SportMingle.dto.TorneoRequest;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TorneoService {

    private final TorneoRepository torneoRepository;

    @Autowired
    private GeometryFactory geometryFactory;

    @Autowired
    private UsuarioServiceImpl usuarioService;

    @Autowired
    private DeporteService deporteService;

    @Autowired
    public TorneoService(TorneoRepository torneoRepository) {
        this.torneoRepository = torneoRepository;
    }

    public List<Torneo> obtenerTodos() {
        return torneoRepository.findAll();
    }

    public Optional<Torneo> obtenerPorId(Long id) {
        return torneoRepository.findById(id);
    }

    public Torneo crearTorneoDesdeRequest(TorneoRequest request) {
        Point point = geometryFactory.createPoint(new Coordinate(request.getLon(), request.getLat()));
        point.setSRID(4326);

        Torneo torneo = new Torneo();
        torneo.setNombre(request.getNombre());
        torneo.setDescripcion(request.getDescripcion());

        torneo.setOrganizador(usuarioService.findById(request.getIdOrganizador()));
        torneo.setDeporte(deporteService.obtenerDeportePorId(request.getIdDeporte()));

        torneo.setFechaInicio(request.getFechaInicio());
        torneo.setFechaFin(request.getFechaFin());
        torneo.setUbicacion(point);

        torneo.setNumeroFases(request.getNumeroFases());
        torneo.setPremios(request.getPremios());
        torneo.setCostoInscripcion(request.getCostoInscripcion());
        torneo.setMaxEquipos(request.getMaxEquipos());

        if (request.getEstado() != null) {
            torneo.setEstado(Torneo.EstadoTorneo.valueOf(request.getEstado().toLowerCase()));
        }

        torneo.setImagenTorneo(request.getImagenTorneo());


        return torneoRepository.save(torneo);
    }



    public Torneo actualizarTorneo(Long id, Torneo torneoActualizado) {
        return torneoRepository.findById(id).map(torneo -> {
            torneo.setNombre(torneoActualizado.getNombre());
            torneo.setDescripcion(torneoActualizado.getDescripcion());
            torneo.setOrganizador(torneoActualizado.getOrganizador());
            torneo.setDeporte(torneoActualizado.getDeporte());
            torneo.setFechaInicio(torneoActualizado.getFechaInicio());
            torneo.setFechaFin(torneoActualizado.getFechaFin());
            torneo.setUbicacion(torneoActualizado.getUbicacion());
            torneo.setNumeroFases(torneoActualizado.getNumeroFases());
            torneo.setPremios(torneoActualizado.getPremios());
            torneo.setCostoInscripcion(torneoActualizado.getCostoInscripcion());
            torneo.setMaxEquipos(torneoActualizado.getMaxEquipos());
            torneo.setEstado(torneoActualizado.getEstado());
            torneo.setImagenTorneo(torneoActualizado.getImagenTorneo());
            return torneoRepository.save(torneo);
        }).orElseThrow(() -> new RuntimeException("Torneo no encontrado con ID: " + id));
    }

    public void eliminarTorneo(Long idUsuario) {
        torneoRepository.deleteById(idUsuario);
    }

    public List<Torneo> obtenerPorEstado(Torneo.EstadoTorneo estado) {
        return torneoRepository.findByEstado(estado);
    }

    public List<Torneo> obtenerPorDeporte(Long idDeporte) {
        return torneoRepository.findByDeporteId(idDeporte);
    }

    public boolean existePorId(Long id) {
        return torneoRepository.existsById(id);
    }
}
