package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import com.SportMingle.servicios_SportMingle.Model.Deporte;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.ClubesRepository;
import com.SportMingle.servicios_SportMingle.Service.ClubesService;
import com.SportMingle.servicios_SportMingle.Service.DeporteService;
import com.SportMingle.servicios_SportMingle.Service.UsuarioService;
import com.SportMingle.servicios_SportMingle.Service.UsuarioServiceImpl;
import com.SportMingle.servicios_SportMingle.dto.ClubResponse;
import com.SportMingle.servicios_SportMingle.dto.CreateClubRequest;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/clubes")
public class ClubesController {


    @Autowired
    private ClubesService clubesService;

    @Autowired
    private UsuarioServiceImpl usuarioService;

    @Autowired
    private DeporteService deporteService;

    @Autowired
    private GeometryFactory geometryFactory;

    @Autowired
    private ClubesRepository clubesRepository;

    // Crear un club
    @PostMapping
    public ResponseEntity<Clubes> crearClub(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam MultipartFile logo,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFundacion,
            @RequestParam Long id_deporte,
            @RequestParam Long id_usuario_administrador,
            @RequestParam double lat,
            @RequestParam double lon
    ) {
        System.out.println("📥 Recibida solicitud para crear club: " + nombre);
        String logoUrl = null;

        try {
            if (logo != null && !logo.isEmpty()) {
                String nombreLogo = logo.getOriginalFilename();
                Path uploadsDir = Paths.get("uploads");
                if (!Files.exists(uploadsDir)) {
                    Files.createDirectories(uploadsDir);
                }
                Path rutaLogo = uploadsDir.resolve(nombreLogo);
                Files.copy(logo.getInputStream(), rutaLogo, StandardCopyOption.REPLACE_EXISTING);
                logoUrl = rutaLogo.toString();
                System.out.println("✅ Logo guardado en: " + logoUrl);
            }
        } catch (IOException e) {
            System.out.println("❌ Error al guardar el logo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        Clubes club = new Clubes();
        club.setNombre(nombre);
        club.setDescripcion(descripcion);
        club.setFechaFundacion(fechaFundacion);
        club.setLogoUrl(logoUrl);
        club.setUbicacion(geometryFactory.createPoint(new Coordinate(lon, lat)));
        club.getUbicacion().setSRID(4326);

        Usuario admin = usuarioService.findById(id_usuario_administrador);
        Deporte deporte = deporteService.obtenerDeportePorId(id_deporte);

        club.setAdministrador(admin);
        club.setDeporte(deporte);

        return ResponseEntity.ok(clubesRepository.save(club));
    }


    // Buscar clubes cercanos

    @GetMapping("/cercanos")
    public ResponseEntity<List<ClubResponse>> buscarClubesCercanos(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam double distancia,
            @RequestParam String deporte
    ) {
        List<Clubes> clubes = clubesService.obtenerClubesCercanos(lat, lon, distancia, deporte);
        List<ClubResponse> respuesta = clubes.stream()
                .map(ClubResponse::new)
                .toList();
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubResponse> obtenerClubPorId(@PathVariable Long id) {
        return clubesService.obtenerPorId(id)
                .map(club -> ResponseEntity.ok(new ClubResponse(club)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/organizador/{idOrganizador}")
    public ResponseEntity<ClubResponse> obtenerClubPorOrganizador(@PathVariable Long idOrganizador) {
        try {
            Clubes club = clubesService.obtenerClubPorOrganizador(idOrganizador);
            return ResponseEntity.ok(new ClubResponse(club));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }




}
