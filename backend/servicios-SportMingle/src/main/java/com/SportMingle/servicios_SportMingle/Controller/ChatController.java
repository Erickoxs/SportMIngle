package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.MensajeChat;
import com.SportMingle.servicios_SportMingle.Model.MensajeEliminado;
import com.SportMingle.servicios_SportMingle.Service.ChatService;
import com.SportMingle.servicios_SportMingle.dto.EliminacionWebSocketDTO;
import com.SportMingle.servicios_SportMingle.dto.MensajeChatDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    public static class MensajeRequest {
        private Long idRemitente;
        private String contenido;

        public Long getIdRemitente() { return idRemitente; }
        public void setIdRemitente(Long idRemitente) { this.idRemitente = idRemitente; }

        public String getContenido() { return contenido; }
        public void setContenido(String contenido) { this.contenido = contenido; }
    }


    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/enviar/{idSala}")
    public void enviarMensajeWS(@DestinationVariable Long idSala, MensajeRequest request) {
        Long idRemitente = request.getIdRemitente(); // lo mandamos desde el frontend
        MensajeChat mensaje = chatService.enviarMensaje(idRemitente, idSala, request.getContenido());
        MensajeChatDTO mensajeDTO = new MensajeChatDTO(mensaje);

        messagingTemplate.convertAndSend("/topic/chat/" + idSala, mensajeDTO);
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
            @RequestParam Long idSala,
            @RequestParam MensajeEliminado.Razon razon
    ) {
        chatService.eliminarMensajeParaUsuario(idMensaje, idUsuario, razon);

        messagingTemplate.convertAndSend("/topic/chat/" + idSala, new EliminacionWebSocketDTO(idMensaje));

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
