package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Torneo;
import com.SportMingle.servicios_SportMingle.Repository.TorneoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TorneoService {

    private final TorneoRepository torneoRepository;

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

    public Torneo crearTorneo(Torneo torneo) {
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
            torneo.setDireccion(torneoActualizado.getDireccion());
            torneo.setLatitud(torneoActualizado.getLatitud());
            torneo.setLongitud(torneoActualizado.getLongitud());
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
