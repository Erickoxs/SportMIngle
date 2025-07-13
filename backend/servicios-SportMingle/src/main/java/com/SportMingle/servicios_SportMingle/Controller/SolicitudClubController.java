package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.SolicitudClub;
import com.SportMingle.servicios_SportMingle.Service.SolicitudClubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudClubController {

    private final SolicitudClubService service;

    public SolicitudClubController(SolicitudClubService service) {
        this.service = service;
    }

    @GetMapping("/club/{idClub}/pendientes")
    public ResponseEntity<List<SolicitudClub>> obtenerSolicitudesPendientesPorClub(@PathVariable Long idClub) {
        List<SolicitudClub> solicitudes = service.obtenerSolicitudesPendientesPorClub(idClub);
        return ResponseEntity.ok(solicitudes);
    }

    @PostMapping("/solicitar")
    public ResponseEntity<Void> solicitarIngreso(@RequestParam Long idUsuario, @RequestParam Long idClub) {
        service.solicitarIngreso(idUsuario, idClub);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/invitar")
    public ResponseEntity<Void> invitarUsuario(@RequestParam Long idClub, @RequestParam Long idUsuario) {
        service.invitarUsuario(idClub, idUsuario);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/aceptar")
    public ResponseEntity<Void> aceptar(@PathVariable Long id) {
        service.aceptar(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/rechazar")
    public ResponseEntity<Void> rechazar(@PathVariable Long id) {
        service.rechazar(id);
        return ResponseEntity.ok().build();
    }
}
