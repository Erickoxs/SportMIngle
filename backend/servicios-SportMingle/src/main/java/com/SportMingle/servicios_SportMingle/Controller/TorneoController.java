package com.SportMingle.servicios_SportMingle.Controller;


import com.SportMingle.servicios_SportMingle.Model.Torneo;
import com.SportMingle.servicios_SportMingle.Service.TorneoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/torneos")
public class TorneoController {

    private final TorneoService torneoService;

    @Autowired
    public TorneoController(TorneoService torneoService) {
        this.torneoService = torneoService;
    }

    @GetMapping
    public List<Torneo> listarTorneos() {
        return torneoService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Torneo> obtenerTorneoPorId(@PathVariable Long id) {
        return torneoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Torneo> crearTorneo(@RequestBody Torneo torneo) {
        return ResponseEntity.ok(torneoService.crearTorneo(torneo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Torneo> actualizarTorneo(@PathVariable Long id, @RequestBody Torneo torneoActualizado) {
        try {
            return ResponseEntity.ok(torneoService.actualizarTorneo(id, torneoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTorneo(@PathVariable Long id) {
        torneoService.eliminarTorneo(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/estado/{estado}")
    public List<Torneo> obtenerPorEstado(@PathVariable Torneo.EstadoTorneo estado) {
        return torneoService.obtenerPorEstado(estado);
    }

    @GetMapping("/deporte/{idDeporte}")
    public List<Torneo> obtenerPorDeporte(@PathVariable Long idDeporte) {
        return torneoService.obtenerPorDeporte(idDeporte);
    }
}
