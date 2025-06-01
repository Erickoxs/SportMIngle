package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Deporte;
import com.SportMingle.servicios_SportMingle.Repository.DeporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeporteService {

    private final DeporteRepository deporteRepository;

    @Autowired
    public DeporteService(DeporteRepository deporteRepository) {
        this.deporteRepository = deporteRepository;
    }

    // Crear deporte
    public Deporte crearDeporte(Deporte deporte) {
        if (deporteRepository.existsByNombre(deporte.getNombre())) {
            throw new IllegalArgumentException("Ya existe un deporte con ese nombre.");
        }
        return deporteRepository.save(deporte);
    }

    // Listar todos los deportes
    public List<Deporte> obtenerTodosLosDeportes() {
        return deporteRepository.findAll();
    }

    // Buscar por ID
    public Optional<Deporte> obtenerDeportePorId(Long id) {
        return deporteRepository.findById(id);
    }
}
