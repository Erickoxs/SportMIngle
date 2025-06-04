package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.MensajeChat;

import java.util.List;

public interface MensajeChatService {
    MensajeChat guardarMensaje(MensajeChat mensaje);
    List<MensajeChat> obtenerMensajesPorSala(Long salaId);
    MensajeChat obtenerMensajePorId(Long id);
    void marcarComoLeido(Long id);
}