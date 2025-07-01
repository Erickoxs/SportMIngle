package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.MiembroClub;
import com.SportMingle.servicios_SportMingle.Service.MiembroClubService;
import com.SportMingle.servicios_SportMingle.dto.MiembroClubResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/miembros")
public class MiembroClubController {

    private final MiembroClubService miembroClubService;

    public MiembroClubController(MiembroClubService miembroClubService) {
        this.miembroClubService = miembroClubService;
    }

    // Obtener miembros por ID de club
    @GetMapping("/club/{idClub}")
    public ResponseEntity<List<MiembroClubResponse>> obtenerPorClub(@PathVariable Long idClub) {
        List<MiembroClubResponse> response = miembroClubService.obtenerMiembrosPorClub(idClub);
        return ResponseEntity.ok(response);
    }


    // Obtener miembros por ID de usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MiembroClub>> obtenerPorDeportista(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(miembroClubService.obtenerPorDeportista(idUsuario));
    }

    // Verificar si un usuario es miembro activo de un club
    @GetMapping("/es-miembro-activo")
    public ResponseEntity<Boolean> esMiembroActivo(@RequestParam Long idUsuario, @RequestParam Long idClub) {
        boolean esActivo = miembroClubService.esMiembroActivo(idUsuario, idClub);
        return ResponseEntity.ok(esActivo);
    }

    // Crear o actualizar miembro
    @PostMapping
    public ResponseEntity<MiembroClub> guardarMiembro(@RequestBody MiembroClub miembroClub) {
        return ResponseEntity.ok(miembroClubService.guardarMiembro(miembroClub));
    }

    // Eliminar miembro por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMiembro(@PathVariable Long id) {
        miembroClubService.eliminarMiembro(id);
        return ResponseEntity.noContent().build();
    }
}
