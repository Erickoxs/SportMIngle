package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.Torneo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TorneoResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private double lat;
    private double lon;
    private String deporte;
    private Torneo.EstadoTorneo estado; // Deberá ser uno de: "inscripciones", "en_progreso", "finalizado", "cancelado"
    private String imagenTorneo;
    private BigDecimal costoInscripcion;
    private Long idOrganizador;

    public TorneoResponse(Torneo torneo) {
        this.id = torneo.getId();
        this.nombre = torneo.getNombre();
        this.descripcion = torneo.getDescripcion();
        this.fechaInicio = torneo.getFechaInicio();
        this.fechaFin = torneo.getFechaFin();
        this.lat = torneo.getUbicacion().getY(); // latitud
        this.lon = torneo.getUbicacion().getX(); // longitud
        this.deporte = torneo.getDeporte().getNombre();
        this.estado = torneo.getEstado();
        this.imagenTorneo = torneo.getImagenTorneo();
        this.costoInscripcion = torneo.getCostoInscripcion();
        if (torneo.getOrganizador() != null) {
            this.idOrganizador = torneo.getOrganizador().getIdUsuario();
        }
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

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
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

    public String getImagenTorneo() {
        return imagenTorneo;
    }

    public BigDecimal getCostoInscripcion() {
        return costoInscripcion;
    }

    public Torneo.EstadoTorneo getEstado() {
        return estado;
    }

    public Long getIdOrganizador() {
        return idOrganizador;
    }

}
