package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.Clubes;

public class ClubResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private double lat;
    private double lon;
    private String logoUrl;
    private String deporte;

    public ClubResponse(Clubes club) {
        this.id = club.getId();
        this.nombre = club.getNombre();
        this.descripcion = club.getDescripcion();
        this.lat = club.getUbicacion().getY(); // latitud
        this.lon = club.getUbicacion().getX(); // longitud
        this.deporte = club.getDeporte().getNombre();
        this.logoUrl = club.getLogoUrl();
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

    public double getLat() {
        return lat;
    }

    public double getLon() {
        return lon;
    }

    public String getDeporte() {
        return deporte;
    }

    public String getLogoUrl() {
        return logoUrl;
    }
}
