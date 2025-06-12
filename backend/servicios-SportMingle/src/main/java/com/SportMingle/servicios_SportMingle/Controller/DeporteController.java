package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.Deporte;
import com.SportMingle.servicios_SportMingle.Service.DeporteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/deportes")
public class DeporteController {

    private final DeporteService deporteService;

    @Autowired
    public DeporteController(DeporteService deporteService) {
        this.deporteService = deporteService;
    }

    // GET /api/deportes
    @GetMapping
    public ResponseEntity<List<Deporte>> obtenerTodosLosDeportes() {
        List<Deporte> deportes = deporteService.obtenerTodosLosDeportes();
        return ResponseEntity.ok(deportes);
    }

    // GET /api/deportes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Deporte> obtenerDeportePorId(@PathVariable Long id) {
        try {
            Deporte deporte = deporteService.obtenerDeportePorId(id);
            return ResponseEntity.ok(deporte);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


    // POST /api/deportes
    @PostMapping
    public ResponseEntity<Deporte> crearDeporte(@RequestBody Deporte deporte) {
        try {
            Deporte nuevoDeporte = deporteService.crearDeporte(deporte);
            return ResponseEntity.ok(nuevoDeporte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
