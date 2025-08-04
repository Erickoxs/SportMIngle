package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.PartidoTorneo;
import com.SportMingle.servicios_SportMingle.Service.PartidoTorneoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/partidos-torneo")
public class PartidoTorneoController {

    private final PartidoTorneoService partidoTorneoService;

    @Autowired
    public PartidoTorneoController(PartidoTorneoService partidoTorneoService) {
        this.partidoTorneoService = partidoTorneoService;
    }

    // Obtener todos los partidos
    @GetMapping
    public ResponseEntity<List<PartidoTorneo>> getAllPartidos() {
        List<PartidoTorneo> partidos = partidoTorneoService.getAllPartidos();
        return ResponseEntity.ok(partidos);
    }

    // Obtener partido por ID
    @GetMapping("/{id}")
    public ResponseEntity<PartidoTorneo> getPartidoById(@PathVariable Long id) {
        Optional<PartidoTorneo> partido = partidoTorneoService.getPartidoById(id);
        return partido.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo partido
    @PostMapping
    public ResponseEntity<PartidoTorneo> crearPartido(@RequestBody PartidoTorneo partido) {
        PartidoTorneo creado = partidoTorneoService.crearPartido(partido);
        return ResponseEntity.ok(creado);
    }

    // Actualizar un partido existente
    @PutMapping("/{id}")
    public ResponseEntity<PartidoTorneo> actualizarPartido(@PathVariable Long id, @RequestBody PartidoTorneo partido) {
        if (!id.equals(partido.getIdPartido())) {
            return ResponseEntity.badRequest().build();
        }
        PartidoTorneo actualizado = partidoTorneoService.actualizarPartido(partido);
        return ResponseEntity.ok(actualizado);
    }
    @PutMapping("/{id}/resultados")
    public ResponseEntity<PartidoTorneo> actualizarResultados(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> resultados) {

        Integer resultadoLocal = resultados.get("resultadoLocal");
        Integer resultadoVisitante = resultados.get("resultadoVisitante");

        PartidoTorneo partidoActualizado = partidoTorneoService.actualizarResultados(id, resultadoLocal, resultadoVisitante);

        return ResponseEntity.ok(partidoActualizado);
    }


    // Eliminar partido por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPartido(@PathVariable Long id) {
        partidoTorneoService.eliminarPartido(id);
        return ResponseEntity.noContent().build();
    }

    // Buscar partidos por torneo
    @GetMapping("/torneo/{idTorneo}")
    public ResponseEntity<List<PartidoTorneo>> buscarPorTorneo(@PathVariable Long idTorneo) {
        List<PartidoTorneo> partidos = partidoTorneoService.buscarPorTorneo(idTorneo);
        return ResponseEntity.ok(partidos);
    }
}
