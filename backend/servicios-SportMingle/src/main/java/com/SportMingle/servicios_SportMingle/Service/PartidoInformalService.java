package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Repository.PartidoInformalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartidoInformalService {

    private final PartidoInformalRepository partidoInformalRepository;

    @Autowired
    public PartidoInformalService(PartidoInformalRepository partidoInformalRepository) {
        this.partidoInformalRepository = partidoInformalRepository;
    }

    public List<PartidoInformal> getAllPartidos() {
        return partidoInformalRepository.findAll();
    }

    public Optional<PartidoInformal> getPartidoById(Long id) {
        return partidoInformalRepository.findById(id);
    }

    public PartidoInformal crearPartido(PartidoInformal partido) {
        return partidoInformalRepository.save(partido);
    }

    public PartidoInformal actualizarPartido(PartidoInformal partido) {
        if (partido.getIdPartidoInformal() == null) {
            throw new IllegalArgumentException("El ID del partido informal es requerido para actualizar");
        }
        return partidoInformalRepository.save(partido);
    }

    public void eliminarPartido(Long id) {
        partidoInformalRepository.deleteById(id);
    }

    public List<PartidoInformal> buscarPorDeporte(Long idDeporte) {
        return partidoInformalRepository.findByDeporteId(idDeporte);
    }

    public List<PartidoInformal> buscarPorNivelRequerido(String nivelRequerido) {
        return partidoInformalRepository.findByNivelRequerido(nivelRequerido);
    }


    public List<PartidoInformal> buscarPorDeporteYNivel(Long idDeporte, String nivelRequerido) {
        return partidoInformalRepository.findByDeporteIdAndNivelRequerido(idDeporte, nivelRequerido);
    }
}

