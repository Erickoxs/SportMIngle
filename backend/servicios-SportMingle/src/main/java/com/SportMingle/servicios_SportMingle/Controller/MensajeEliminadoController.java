package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.MensajeEliminado;
import com.SportMingle.servicios_SportMingle.Service.MensajeEliminadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes-eliminados")
public class MensajeEliminadoController {

    private final MensajeEliminadoService service;

    public MensajeEliminadoController(MensajeEliminadoService service) {
        this.service = service;
    }

    @GetMapping
    public List<MensajeEliminado> obtenerTodos() {
        return service.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MensajeEliminado> obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MensajeEliminado crear(@RequestBody MensajeEliminado mensajeEliminado) {
        return service.guardar(mensajeEliminado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.obtenerPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
