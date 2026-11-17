package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.Torneo;
import com.SportMingle.servicios_SportMingle.Service.CloudinaryService;
import com.SportMingle.servicios_SportMingle.Service.TorneoService;
import com.SportMingle.servicios_SportMingle.dto.TorneoResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/torneos")
public class TorneoController {

    private static final Logger log = LoggerFactory.getLogger(TorneoController.class);

    private final TorneoService torneoService;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public TorneoController(TorneoService torneoService, CloudinaryService cloudinaryService) {
        this.torneoService = torneoService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public List<Torneo> listarTorneos() {
        return torneoService.obtenerTodos();
    }

    @GetMapping("/cercanos")
    public ResponseEntity<List<TorneoResponse>> buscarTorneosCercanos(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam double distancia,
            @RequestParam String deporte
    ) {
        List<Torneo> torneos = torneoService.buscarTorneosCercanos(lat, lon, distancia, deporte);
        List<TorneoResponse> respuesta = torneos.stream()
                .map(TorneoResponse::new)
                .toList();
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/estado/{estado}")
    public List<Torneo> obtenerPorEstado(@PathVariable Torneo.EstadoTorneo estado) {
        return torneoService.obtenerPorEstado(estado);
    }

    @GetMapping("/deporte/{idDeporte}")
    public List<Torneo> obtenerPorDeporte(@PathVariable Long idDeporte) {
        return torneoService.obtenerPorDeporte(idDeporte);
    }
    @GetMapping("/{id}")
    public ResponseEntity<TorneoResponse> obtenerTorneoPorId(@PathVariable Long id) {
        return torneoService.obtenerPorId(id)
                .map(torneo -> ResponseEntity.ok(new TorneoResponse(torneo)))
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<Torneo> crearTorneo(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Long idDeporte,
            @RequestParam Long idOrganizador,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(required = false) Integer numeroFases,
            @RequestParam(required = false) String premios,
            @RequestParam(required = false) BigDecimal costoInscripcion,
            @RequestParam(required = false) Integer maxEquipos,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) MultipartFile imagenTorneo
    ) {
        log.info("POST /api/torneos — nombre='{}', idOrganizador={}, idDeporte={}", nombre, idOrganizador, idDeporte);
        log.debug("Parámetros completos — fechaInicio={}, fechaFin={}, lat={}, lon={}, fases={}, maxEquipos={}",
                fechaInicio, fechaFin, lat, lon, numeroFases, maxEquipos);

        String urlImagen = null;

        try {
            if (imagenTorneo != null && !imagenTorneo.isEmpty()) {
                Map uploadResult = cloudinaryService.uploadFile(imagenTorneo, "torneos");
                urlImagen = uploadResult.get("secure_url").toString();
                log.info("Imagen subida a Cloudinary: {}", urlImagen);
            } else {
                log.debug("No se recibió imagen para el torneo '{}'", nombre);
            }
        } catch (IOException e) {
            log.error("Error al subir imagen a Cloudinary para torneo '{}': {}", nombre, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        Torneo torneo = torneoService.crearTorneo(
                nombre, descripcion, idDeporte, idOrganizador, fechaInicio, fechaFin,
                lat, lon, numeroFases, premios, costoInscripcion, maxEquipos, estado, urlImagen
        );

        log.info("Torneo creado exitosamente — id={}, nombre='{}'", torneo.getId(), torneo.getNombre());

        return ResponseEntity.ok(torneo);
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






}
