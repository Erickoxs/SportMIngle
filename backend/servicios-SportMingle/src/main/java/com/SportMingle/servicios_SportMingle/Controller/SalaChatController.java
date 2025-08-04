package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.SalaChat;
import com.SportMingle.servicios_SportMingle.Service.SalaChatService;
import com.SportMingle.servicios_SportMingle.dto.AbrirSalaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/salas")
public class SalaChatController {

    private final SalaChatService salaChatService;

    @Autowired
    public SalaChatController(SalaChatService salaChatService) {
        this.salaChatService = salaChatService;
    }

    @GetMapping
    public List<SalaChat> getTodasLasSalas() {
        return salaChatService.getTodasLasSalas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaChat> getSalaPorId(@PathVariable Long id) {
        Optional<SalaChat> salaOpt = salaChatService.getSalaPorId(id);
        return salaOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tipo/{tipo}")
    public List<SalaChat> getSalasPorTipo(@PathVariable SalaChat.TipoSala tipo) {
        return salaChatService.getSalasPorTipo(tipo);
    }

    @GetMapping("/tipo/{tipo}/referencia/{idReferencia}")
    public Optional<SalaChat> getSalasPorTipoYReferencia(
            @PathVariable SalaChat.TipoSala tipo,
            @PathVariable Long idReferencia) {
        return salaChatService.getSalasPorTipoYReferencia(tipo, idReferencia);
    }
    @PostMapping("/abrir")
    public ResponseEntity<?> abrirSala(@RequestBody AbrirSalaRequest request) {
        SalaChat.TipoSala tipo;

        switch (request.getTipoSala()) {
            case "partidos":
                tipo = SalaChat.TipoSala.partido;
                break;
            case "torneos":
                tipo = SalaChat.TipoSala.torneo;
                break;
            case "clubes":
                tipo = SalaChat.TipoSala.club;
                break;

            default:
                return ResponseEntity.badRequest().body("Tipo de sala no reconocido: " + request.getTipoSala());
        }

        Optional<SalaChat> existente = salaChatService.buscarPorTipoYReferencia(tipo, request.getIdReferencia());

        if (existente.isPresent()) {
            return ResponseEntity.ok(existente.get());
        }

        SalaChat nuevaSala = new SalaChat();
        nuevaSala.setTipoSala(tipo);
        nuevaSala.setIdReferencia(request.getIdReferencia());
        nuevaSala.setFechaCreacion(LocalDateTime.now());
        nuevaSala.setNombreSala("Sala de " + tipo + " #" + request.getIdReferencia());

        SalaChat creada = salaChatService.crearSala(nuevaSala);
        return ResponseEntity.ok(creada);
    }



    @PostMapping
    public ResponseEntity<SalaChat> crearSala(@RequestBody SalaChat sala) {
        SalaChat nuevaSala = salaChatService.crearSala(sala);
        return ResponseEntity.ok(nuevaSala);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaChat> actualizarSala(@PathVariable Long id, @RequestBody SalaChat sala) {
        Optional<SalaChat> salaExistente = salaChatService.getSalaPorId(id);
        if (!salaExistente.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        sala.setIdSala(id);
        SalaChat salaActualizada = salaChatService.actualizarSala(sala);
        return ResponseEntity.ok(salaActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSala(@PathVariable Long id) {
        Optional<SalaChat> salaExistente = salaChatService.getSalaPorId(id);
        if (!salaExistente.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        salaChatService.eliminarSala(id);
        return ResponseEntity.noContent().build();
    }
}
