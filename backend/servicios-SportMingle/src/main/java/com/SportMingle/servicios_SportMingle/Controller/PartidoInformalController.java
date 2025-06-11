package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Service.PartidoInformalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Coordinate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/partidos-informales")
public class PartidoInformalController {

    @Autowired
    private GeometryFactory geometryFactory;

    public Point construirPunto(double lat, double lon) {
        return geometryFactory.createPoint(new Coordinate(lon, lat));
    }

    private final PartidoInformalService partidoInformalService;

    @Autowired
    public PartidoInformalController(PartidoInformalService partidoInformalService) {
        this.partidoInformalService = partidoInformalService;
    }

    // Obtener todos los partidos informales
    @GetMapping
    public ResponseEntity<List<PartidoInformal>> getAllPartidos() {
        List<PartidoInformal> partidos = partidoInformalService.getAllPartidos();
        return ResponseEntity.ok(partidos);
    }

    // Obtener partido informal por ID
    @GetMapping("/{id}")
    public ResponseEntity<PartidoInformal> getPartidoById(@PathVariable Long id) {
        Optional<PartidoInformal> partido = partidoInformalService.getPartidoById(id);
        return partido.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo partido informal
    @PostMapping
    public ResponseEntity<PartidoInformal> crearPartido(@RequestBody PartidoInformal partido) {
        PartidoInformal creado = partidoInformalService.crearPartido(partido);
        return ResponseEntity.ok(creado);
    }

    // Actualizar un partido informal existente
    @PutMapping("/{id}")
    public ResponseEntity<PartidoInformal> actualizarPartido(@PathVariable Long id, @RequestBody PartidoInformal partido) {
        if (!id.equals(partido.getIdPartidoInformal())) {
            return ResponseEntity.badRequest().build();
        }
        PartidoInformal actualizado = partidoInformalService.actualizarPartido(partido);
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar partido informal por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPartido(@PathVariable Long id) {
        partidoInformalService.eliminarPartido(id);
        return ResponseEntity.noContent().build();
    }

    // Buscar partidos por deporte
    @GetMapping("/deporte/{idDeporte}")
    public ResponseEntity<List<PartidoInformal>> buscarPorDeporte(@PathVariable Long idDeporte) {
        List<PartidoInformal> partidos = partidoInformalService.buscarPorDeporte(idDeporte);
        return ResponseEntity.ok(partidos);
    }

    // Buscar partidos por nivel requerido
    @GetMapping("/nivel")
    public ResponseEntity<List<PartidoInformal>> buscarPorNivelRequerido(@RequestParam String nivelRequerido) {
        List<PartidoInformal> partidos = partidoInformalService.buscarPorNivelRequerido(nivelRequerido);
        return ResponseEntity.ok(partidos);
    }

    // Buscar partidos por deporte y nivel requerido
    @GetMapping("/buscar")
    public ResponseEntity<List<PartidoInformal>> buscarPorDeporteYNivel(
            @RequestParam Long idDeporte,
            @RequestParam String nivelRequerido) {

        List<PartidoInformal> partidos = partidoInformalService.buscarPorDeporteYNivel(idDeporte, nivelRequerido);
        return ResponseEntity.ok(partidos);
    }
    @GetMapping("/api/partidos")
    public List<PartidoInformal> buscarPartidosCercanos(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam String deporte) {

        Point userLocation = geometryFactory.createPoint(new Coordinate(lon, lat));
        return partidoInformalService.buscarCercanos(userLocation, deporte);
    }
}
