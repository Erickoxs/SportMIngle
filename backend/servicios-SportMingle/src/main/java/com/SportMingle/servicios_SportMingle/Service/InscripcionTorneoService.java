package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.InscripcionTorneo;
import com.SportMingle.servicios_SportMingle.Repository.InscripcionTorneoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InscripcionTorneoService {

    private final InscripcionTorneoRepository inscripcionTorneoRepository;

    public InscripcionTorneoService(InscripcionTorneoRepository inscripcionTorneoRepository) {
        this.inscripcionTorneoRepository = inscripcionTorneoRepository;
    }

    public List<InscripcionTorneo> obtenerPorTorneo(Long idTorneo) {
        return inscripcionTorneoRepository.findByTorneoId(idTorneo);
    }

    public List<InscripcionTorneo> obtenerPorClub(Long idClub) {
        return inscripcionTorneoRepository.findByClubesId(idClub);
    }

    public InscripcionTorneo guardarInscripcion(InscripcionTorneo inscripcion) {
        return inscripcionTorneoRepository.save(inscripcion);
    }

    public void eliminarInscripcion(Long id) {
        inscripcionTorneoRepository.deleteById(id);
    }
}
