package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.ParticipanteChat;
import com.SportMingle.servicios_SportMingle.Repository.ParticipanteChatRepository;
import com.SportMingle.servicios_SportMingle.Repository.SalaChatRepository;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import com.SportMingle.servicios_SportMingle.Service.ParticipanteChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/participantes")
public class ParticipanteChatController {


    private final ParticipanteChatService participanteChatService;

    @Autowired
    public ParticipanteChatController(ParticipanteChatService participanteChatService) {
        this.participanteChatService = participanteChatService;
    }

    @GetMapping("/sala/{idSala}")
    public List<ParticipanteChat> obtenerPorSala(@PathVariable Long idSala) {
        return participanteChatService.obtenerPorSala(idSala);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<ParticipanteChat> obtenerPorUsuario(@PathVariable Long idUsuario) {
        return participanteChatService.obtenerPorUsuario(idUsuario);
    }

    @PostMapping
    public ResponseEntity<ParticipanteChat> agregarParticipante(@RequestBody ParticipanteChat participante) {
        ParticipanteChat nuevo = participanteChatService.agregarParticipante(participante);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParticipanteChat> actualizarParticipante(@PathVariable Long id, @RequestBody ParticipanteChat participante) {
        Optional<ParticipanteChat> existente = participanteChatService.obtenerPorId(id);
        if (!existente.isPresent()) return ResponseEntity.notFound().build();

        participante.setIdParticipante(id);
        ParticipanteChat actualizado = participanteChatService.actualizarParticipante(participante);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarParticipante(@PathVariable Long id) {
        Optional<ParticipanteChat> existente = participanteChatService.obtenerPorId(id);
        if (!existente.isPresent()) return ResponseEntity.notFound().build();

        participanteChatService.eliminarParticipante(id);
        return ResponseEntity.noContent().build();
    }
}
