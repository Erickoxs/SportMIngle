package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.Torneo;

import java.time.LocalDateTime;

public class TorneoResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaHora;
    private double lat;
    private double lon;
    private String deporte;

    public TorneoResponse(Torneo torneo) {
        this.id = torneo.getId();
        this.nombre = torneo.getNombre();
        this.descripcion = torneo.getDescripcion();
        this.fechaHora = torneo.getFechaCreacion();
        this.lat = torneo.getUbicacion().getY(); // latitud
        this.lon = torneo.getUbicacion().getX(); // longitud
        this.deporte = torneo.getDeporte().getNombre();
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
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
