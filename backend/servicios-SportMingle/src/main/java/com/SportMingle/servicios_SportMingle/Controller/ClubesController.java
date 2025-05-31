package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import com.SportMingle.servicios_SportMingle.Service.ClubesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clubes")
public class ClubesController {

    @Autowired
    private ClubesService clubesService;

    @PostMapping
    public ResponseEntity<Clubes> crearClub(@RequestBody Clubes club) {
        Clubes nuevoClub = clubesService.crearClub(club);
        return ResponseEntity.ok(nuevoClub);
    }
}
