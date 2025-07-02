package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.MensajeChat;

import java.time.LocalDateTime;

public class MensajeChatDTO {
    private Long idMensaje;
    private String contenido;
    private LocalDateTime fechaEnvio;
    private boolean leido;
    private String tipo;
    private Long idUsuario;
    private Long idMensajeRespuesta;

    public MensajeChatDTO(MensajeChat mensaje) {
        this.idMensaje = mensaje.getIdMensaje();
        this.contenido = mensaje.getContenido();
        this.fechaEnvio = mensaje.getFechaEnvio();
        this.leido = mensaje.isLeido();
        this.tipo = mensaje.getTipo().name();
        this.idUsuario = mensaje.getUsuario().getIdUsuario();
        this.idMensajeRespuesta = mensaje.getMensajeRespuesta() != null
                ? mensaje.getMensajeRespuesta().getIdMensaje()
                : null;
    }

    // Getters
    public Long getIdMensaje() {
        return idMensaje;
    }

    public String getContenido() {
        return contenido;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public boolean isLeido() {
        return leido;
    }

    public String getTipo() {
        return tipo;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public Long getIdMensajeRespuesta() {
        return idMensajeRespuesta;
    }
}
