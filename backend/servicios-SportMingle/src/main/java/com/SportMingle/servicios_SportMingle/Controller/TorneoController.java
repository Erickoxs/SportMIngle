package com.SportMingle.servicios_SportMingle.Controller;


import com.SportMingle.servicios_SportMingle.Model.Torneo;
import com.SportMingle.servicios_SportMingle.Service.TorneoService;
import com.SportMingle.servicios_SportMingle.dto.TorneoRequest;
import com.SportMingle.servicios_SportMingle.dto.TorneoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
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
    public ResponseEntity<Torneo> obtenerTorneoPorId(@PathVariable Long id) {
        return torneoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
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
        System.out.println("✅ Entró al controlador POST /api/torneos");
        System.out.println("Nombre: " + nombre);
        System.out.println("Descripción: " + descripcion);
        System.out.println("ID Deporte: " + idDeporte);
        System.out.println("ID Organizador: " + idOrganizador);
        System.out.println("Fecha Inicio: " + fechaInicio);
        System.out.println("Fecha Fin: " + fechaFin);
        System.out.println("Lat: " + lat + " | Lon: " + lon);
        System.out.println("Número Fases: " + numeroFases);
        System.out.println("Premios: " + premios);
        System.out.println("Costo Inscripción: " + costoInscripcion);
        System.out.println("Max Equipos: " + maxEquipos);
        System.out.println("Estado: " + estado);
        System.out.println("¿Imagen recibida?: " + (imagenTorneo != null && !imagenTorneo.isEmpty()));

        String nombreImagen = null;

        try {
            if (imagenTorneo != null && !imagenTorneo.isEmpty()) {
                String nombreOriginal = imagenTorneo.getOriginalFilename();
                System.out.println("Nombre original de la imagen: " + nombreOriginal);

                Path uploadsDir = Paths.get("uploads");
                if (!Files.exists(uploadsDir)) {
                    Files.createDirectories(uploadsDir);
                    System.out.println("🛠️ Carpeta 'uploads' creada.");
                }

                Path rutaArchivo = uploadsDir.resolve(nombreOriginal);
                Files.copy(imagenTorneo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);
                nombreImagen = rutaArchivo.toString();
                System.out.println("✅ Imagen guardada en: " + nombreImagen);
            } else {
                System.out.println("⚠️ No se recibió ninguna imagen.");
            }
        } catch (IOException e) {
            System.out.println("❌ Error al guardar la imagen: " + e.getMessage());
            e.printStackTrace(); // Imprime traza completa
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }


        Torneo torneo = torneoService.crearTorneo(
                nombre, descripcion, idDeporte, idOrganizador, fechaInicio, fechaFin,
                lat, lon, numeroFases, premios, costoInscripcion, maxEquipos, estado, nombreImagen
        );

        System.out.println("✅ Torneo creado con ID: " + torneo.getId());

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
