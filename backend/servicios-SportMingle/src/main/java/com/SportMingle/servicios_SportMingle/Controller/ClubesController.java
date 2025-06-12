package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import com.SportMingle.servicios_SportMingle.Service.ClubesService;
import com.SportMingle.servicios_SportMingle.dto.ClubResponse;
import com.SportMingle.servicios_SportMingle.dto.CreateClubRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubes")
public class ClubesController {

    @Autowired
    private ClubesService clubesService;

    // Crear un club
    @PostMapping
    public ResponseEntity<Clubes> crearClub(@RequestBody CreateClubRequest request) {
        Clubes clubCreado = clubesService.crearClub(request);
        return new ResponseEntity<>(clubCreado, HttpStatus.CREATED);
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


}
