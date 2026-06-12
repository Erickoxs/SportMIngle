package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.JugadorPartidoInformal;

public class JugadorPartidoInformalResponse {

    private Long id;
    private String nombreJugador;
    private Long idPartido;

    public JugadorPartidoInformalResponse(JugadorPartidoInformal jugador) {
        this.id = jugador.getIdInscripcion();
        this.nombreJugador = jugador.getJugador().getNombre(); // Asegúrate de que jugador no sea null
        this.idPartido = jugador.getPartidoInformal().getIdPartido();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getNombreJugador() {
        return nombreJugador;
    }

    public Long getIdPartido() {
        return idPartido;
    }
}
