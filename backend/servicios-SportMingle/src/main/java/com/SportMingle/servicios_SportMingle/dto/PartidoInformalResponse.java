package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;

import java.time.LocalDateTime;

public class PartidoInformalResponse {

    private Long id;
    private String descripcion;
    private LocalDateTime fechaHora;
    private double lat;
    private double lon;
    private String deporte;

    public PartidoInformalResponse(PartidoInformal partido) {
        this.id = partido.getIdPartidoInformal();
        this.descripcion = partido.getDescripcion();
        this.fechaHora = partido.getFechaHora();
        this.lat = partido.getUbicacion().getY(); // latitud
        this.lon = partido.getUbicacion().getX(); // longitud
        this.deporte = partido.getDeporte().getNombre();
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public double getLat() {
        return lat;
    }

    public double getLon() {
        return lon;
    }

    public String getDeporte() {
        return deporte;
    }
}
