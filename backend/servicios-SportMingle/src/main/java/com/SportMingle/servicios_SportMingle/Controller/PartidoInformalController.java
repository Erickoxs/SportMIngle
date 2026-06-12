package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Service.PartidoInformalService;
import com.SportMingle.servicios_SportMingle.dto.PartidoInformalRequest;
import com.SportMingle.servicios_SportMingle.dto.PartidoInformalResponse;
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
@RequestMapping("/api/partidos")
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
    @GetMapping("/cercanos")
    public ResponseEntity<List<PartidoInformalResponse>> buscarPartidosCercanos(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam String deporte,
            @RequestParam(defaultValue = "10000") double distancia // opcional: 10km por defecto
    ) {
        List<PartidoInformal> partidos = partidoInformalService.buscarCercanos(lat, lon, deporte, distancia);
        List<PartidoInformalResponse> respuesta = partidos.stream()
                .map(PartidoInformalResponse::new)
                .toList();
        return ResponseEntity.ok(respuesta);
    }



    // Obtener partido informal por ID
    @GetMapping("/{id}")
    public ResponseEntity<PartidoInformalResponse> getPartidoById(@PathVariable Long id) {
        Optional<PartidoInformal> partidoOpt = partidoInformalService.getPartidoById(id);

        if (partidoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PartidoInformal partido = partidoOpt.get();
        PartidoInformalResponse response = new PartidoInformalResponse(partido);

        return ResponseEntity.ok(response);
    }

    // Crear un nuevo partido informal
    @PostMapping
    public ResponseEntity<PartidoInformal> crearPartido(@RequestBody PartidoInformalRequest partido) {
        PartidoInformal creado = partidoInformalService.crearPartidoDesdeRequest(partido);
        return ResponseEntity.ok(creado);
    }

    // Actualizar un partido informal existente
    @PutMapping("/{id}")
    public ResponseEntity<PartidoInformal> actualizarPartido(@PathVariable Long id, @RequestBody PartidoInformal partido) {
        if (!id.equals(partido.getIdPartido())) {
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

}
