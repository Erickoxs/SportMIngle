package com.SportMingle.servicios_SportMingle.Controller;

import com.SportMingle.servicios_SportMingle.Model.MensajeChat;
import com.SportMingle.servicios_SportMingle.Service.MensajeChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeChatController {

    @Autowired
    private MensajeChatService mensajeChatService;

    @PostMapping
    public MensajeChat crearMensaje(@RequestBody MensajeChat mensaje) {
        return mensajeChatService.guardarMensaje(mensaje);
    }

    @GetMapping("/sala/{salaId}")
    public List<MensajeChat> obtenerMensajesPorSala(@PathVariable Long salaId) {
        return mensajeChatService.obtenerMensajesPorSala(salaId);
    }

    @GetMapping("/{id}")
    public MensajeChat obtenerMensajePorId(@PathVariable Long id) {
        return mensajeChatService.obtenerMensajePorId(id);
    }

    @PutMapping("/{id}/leido")
    public void marcarMensajeComoLeido(@PathVariable Long id) {
        mensajeChatService.marcarComoLeido(id);
    }
}