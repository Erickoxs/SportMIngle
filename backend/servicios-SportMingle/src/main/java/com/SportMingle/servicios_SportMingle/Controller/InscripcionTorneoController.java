package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.InscripcionTorneo;
import com.SportMingle.servicios_SportMingle.Repository.InscripcionTorneoRepository;
import com.SportMingle.servicios_SportMingle.Service.InscripcionTorneoService;
import com.SportMingle.servicios_SportMingle.dto.InscripcionTorneoResponse;
import com.SportMingle.servicios_SportMingle.dto.TorneoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionTorneoController {

    private final InscripcionTorneoService inscripcionTorneoService;

    public InscripcionTorneoController(InscripcionTorneoService inscripcionTorneoService) {
        this.inscripcionTorneoService = inscripcionTorneoService;
    }

    // Obtener inscripciones por torneo
    @GetMapping("/torneo/{idTorneo}")
    public ResponseEntity<List<InscripcionTorneoResponse>> obtenerInscripcionesPorTorneo(@PathVariable Long idTorneo) {
        List<InscripcionTorneoResponse> response = inscripcionTorneoService.obtenerInscripcionesPorTorneo(idTorneo);
        return ResponseEntity.ok(response);
    }


    // Obtener inscripciones por club
    @GetMapping("/club/{idClub}")
    public ResponseEntity<List<InscripcionTorneo>> obtenerPorClub(@PathVariable Long idClub) {
        List<InscripcionTorneo> inscripciones = inscripcionTorneoService.obtenerPorClub(idClub);
        return ResponseEntity.ok(inscripciones);
    }

    // Crear o actualizar una inscripción
    @PostMapping
    public ResponseEntity<InscripcionTorneo> guardarInscripcion(@RequestBody InscripcionTorneo inscripcion) {
        InscripcionTorneo guardada = inscripcionTorneoService.guardarInscripcion(inscripcion);
        return ResponseEntity.ok(guardada);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInscripcion(@PathVariable Long id) {
        inscripcionTorneoService.eliminarInscripcion(id);
        return ResponseEntity.noContent().build();
    }
}
