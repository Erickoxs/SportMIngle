package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;

import java.time.LocalDateTime;

public class MiPartidoResponse {

    private Long idPartido;
    private String descripcion;
    private LocalDateTime fechaHora;
    private double lat;
    private double lon;
    private String deporte;
    private String nivelRequerido;
    private Long idOrganizador;
    private String nombreOrganizador;
    private boolean soyOrganizador;
    private Long idInscripcion;
    private boolean esPasado;

    public MiPartidoResponse() {}

    public MiPartidoResponse(PartidoInformal partido, Long idUsuarioActual, Long idInscripcion) {
        this.idPartido = partido.getIdPartido();
        this.descripcion = partido.getDescripcion();
        this.fechaHora = partido.getFechaHora();
        if (partido.getUbicacion() != null) {
            this.lat = partido.getUbicacion().getY();
            this.lon = partido.getUbicacion().getX();
        }
        this.deporte = partido.getDeporte() != null ? partido.getDeporte().getNombre() : "";
        this.nivelRequerido = partido.getNivelRequerido() != null ? partido.getNivelRequerido().name() : "";
        if (partido.getOrganizador() != null) {
            this.idOrganizador = partido.getOrganizador().getIdUsuario();
            this.nombreOrganizador = partido.getOrganizador().getNombre();
            this.soyOrganizador = partido.getOrganizador().getIdUsuario().equals(idUsuarioActual);
        } else {
            this.soyOrganizador = false;
        }
        this.idInscripcion = idInscripcion;
        this.esPasado = partido.getFechaHora() != null && partido.getFechaHora().isBefore(LocalDateTime.now());
    }

    public Long getIdPartido() {
        return idPartido;
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

    public String getNivelRequerido() {
        return nivelRequerido;
    }

    public Long getIdOrganizador() {
        return idOrganizador;
    }

    public String getNombreOrganizador() {
        return nombreOrganizador;
    }

    public boolean isSoyOrganizador() {
        return soyOrganizador;
    }

    public Long getIdInscripcion() {
        return idInscripcion;
    }

    public boolean isEsPasado() {
        return esPasado;
    }
}
