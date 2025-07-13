package com.SportMingle.servicios_SportMingle.dto;

// EliminacionWebSocketDTO.java
public class EliminacionWebSocketDTO {
    private Long idMensaje;
    private String tipo = "MENSAJE_ELIMINADO";

    public EliminacionWebSocketDTO(Long idMensaje) {
        this.idMensaje = idMensaje;
    }

    public Long getIdMensaje() {
        return idMensaje;
    }

    public String getTipo() {
        return tipo;
    }
}
