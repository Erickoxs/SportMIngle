package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.JugadorPartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Service.JugadorPartidoInformalService;
import com.SportMingle.servicios_SportMingle.dto.JugadorPartidoInformalResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jugadores") // o "jugadores-partidos" si preferís
public class JugadorPartidoInformalController {

    private final JugadorPartidoInformalService jugadorPartidoInformalService;

    @Autowired
    public JugadorPartidoInformalController(JugadorPartidoInformalService jugadorPartidoInformalService) {
        this.jugadorPartidoInformalService = jugadorPartidoInformalService;
    }

    @GetMapping
    public List<JugadorPartidoInformal> getTodos() {
        return jugadorPartidoInformalService.getTodos();
    }

    @GetMapping("/por-partido/{idPartido}")
    public ResponseEntity<List<JugadorPartidoInformalResponse>> obtenerPorPartido(@PathVariable Long idPartido) {
        List<JugadorPartidoInformalResponse> response = jugadorPartidoInformalService.obtenerPorPartido(idPartido);
        return ResponseEntity.ok(response);
    }



    @GetMapping("/{id}")
    public Optional<JugadorPartidoInformal> getPorId(@PathVariable Long id) {
        return jugadorPartidoInformalService.getPorId(id);
    }

    @PostMapping
    public JugadorPartidoInformal crear(@RequestBody JugadorPartidoInformal nuevoRegistro) {
        return jugadorPartidoInformalService.crear(nuevoRegistro);
    }

    @PutMapping("/{id}")
    public JugadorPartidoInformal actualizar(@PathVariable Long id, @RequestBody JugadorPartidoInformal datosActualizados) {
        datosActualizados.setIdInscripcion(id);
        return jugadorPartidoInformalService.actualizar(datosActualizados);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        jugadorPartidoInformalService.eliminar(id);
    }
}
