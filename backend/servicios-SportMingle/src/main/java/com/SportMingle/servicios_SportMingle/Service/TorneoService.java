package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Deporte;
import com.SportMingle.servicios_SportMingle.Model.Torneo;
import com.SportMingle.servicios_SportMingle.Repository.TorneoRepository;
import com.SportMingle.servicios_SportMingle.dto.TorneoRequest;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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
        return torneoRepository.findByFechaFinGreaterThanEqualOrderByFechaInicioAsc(LocalDate.now());
    }

    public Optional<Torneo> obtenerPorId(Long id) {
        return torneoRepository.findById(id);
    }

    public Torneo crearTorneo(
            String nombre,
            String descripcion,
            Long idDeporte,
            Long idOrganizador,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            double lat,
            double lon,
            Integer numeroFases,
            String premios,
            BigDecimal costoInscripcion,
            Integer maxEquipos,
            String estado,
            String imagenTorneo // Este es un String (URL), si luego quieres guardar archivos reales, esto cambia
    ) {
        Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
        point.setSRID(4326);

        Torneo torneo = new Torneo();
        torneo.setNombre(nombre);
        torneo.setDescripcion(descripcion);

        torneo.setOrganizador(usuarioService.findById(idOrganizador));
        torneo.setDeporte(deporteService.obtenerDeportePorId(idDeporte));

        torneo.setFechaInicio(fechaInicio);
        torneo.setFechaFin(fechaFin);
        torneo.setUbicacion(point);
        torneo.setNumeroFases(numeroFases);
        torneo.setPremios(premios);
        torneo.setCostoInscripcion(costoInscripcion);
        torneo.setMaxEquipos(maxEquipos);

        if (estado != null) {
            torneo.setEstado(Torneo.EstadoTorneo.valueOf(estado.toLowerCase()));
        }

        torneo.setImagenTorneo(imagenTorneo);

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
        return torneoRepository.findByEstadoAndFechaFinGreaterThanEqual(estado, LocalDate.now());
    }

    public List<Torneo> obtenerPorDeporte(Long idDeporte) {
        return torneoRepository.findByDeporteIdAndFechaFinGreaterThanEqual(idDeporte, LocalDate.now());
    }

    public boolean existePorId(Long id) {
        return torneoRepository.existsById(id);
    }

    public List<Torneo> buscarTorneosCercanos(double lat, double lon, double distancia, String deporte) {
        return torneoRepository.findTorneosCercanosPorDeporte(lat, lon, distancia, deporte);
    }


}
