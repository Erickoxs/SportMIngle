package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.MensajeChat;
import com.SportMingle.servicios_SportMingle.Model.MensajeEliminado;
import com.SportMingle.servicios_SportMingle.Service.ChatService;
import com.SportMingle.servicios_SportMingle.dto.MensajeChatDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    public static class MensajeRequest {
        public String contenido;
    }


    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/enviar")
    public ResponseEntity<MensajeChatDTO> enviarMensaje(
            @RequestParam Long idRemitente,
            @RequestParam Long idSala,
            @RequestBody MensajeRequest request
    ) {
        MensajeChat mensaje = chatService.enviarMensaje(idRemitente, idSala, request.contenido);
        return ResponseEntity.ok(new MensajeChatDTO(mensaje));
    }

    @GetMapping("/mensajes/{idSala}")
    public ResponseEntity<List<MensajeChatDTO>> obtenerMensajes(@PathVariable Long idSala) {
        List<MensajeChat> mensajes = chatService.obtenerMensajesDeSala(idSala);
        List<MensajeChatDTO> dtos = mensajes.stream()
                .map(MensajeChatDTO::new)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/eliminar")
    public ResponseEntity<Void> eliminarMensajeParaUsuario(
            @RequestParam Long idMensaje,
            @RequestParam Long idUsuario,
            @RequestParam MensajeEliminado.Razon razon
    ) {
        chatService.eliminarMensajeParaUsuario(idMensaje, idUsuario, razon);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/ultima-vista")
    public ResponseEntity<Void> actualizarUltimaVista(
            @RequestParam Long idUsuario,
            @RequestParam Long idSala
    ) {
        chatService.actualizarUltimaVista(idUsuario, idSala);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/no-leidos")
    public ResponseEntity<Long> contarMensajesNoLeidos(
            @RequestParam Long idUsuario,
            @RequestParam Long idSala
    ) {
        long cantidad = chatService.contarMensajesNoLeidos(idUsuario, idSala);
        return ResponseEntity.ok(cantidad);
    }
}
