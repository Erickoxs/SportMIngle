package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.InscripcionTorneo;

import java.time.LocalDateTime;

public class InscripcionTorneoResponse {

    private Long idInscripcion;
    private String nombreClub;
    private String nombreTorneo;
    private LocalDateTime fechaInscripcion;
    private boolean pagoRealizado;

    public InscripcionTorneoResponse(InscripcionTorneo inscripcion) {
        this.idInscripcion = inscripcion.getIdInscripcion();
        this.nombreClub = inscripcion.getClubes().getNombre();
        this.nombreTorneo = inscripcion.getTorneo().getNombre();
        this.fechaInscripcion = inscripcion.getFechaInscripcion();
        this.pagoRealizado = inscripcion.isPagoRealizado();


    }

    public Long getIdInscripcion() {
        return idInscripcion;
    }

    public void setIdInscripcion(Long idInscripcion) {
        this.idInscripcion = idInscripcion;
    }

    public String getNombreClub() {
        return nombreClub;
    }

    public void setNombreClub(String nombreClub) {
        this.nombreClub = nombreClub;
    }

    public String getNombreTorneo() {
        return nombreTorneo;
    }

    public void setNombreTorneo(String nombreTorneo) {
        this.nombreTorneo = nombreTorneo;
    }

    public LocalDateTime getFechaInscripcion() {
        return fechaInscripcion;
    }

    public void setFechaInscripcion(LocalDateTime fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }

    public boolean isPagoRealizado() {
        return pagoRealizado;
    }

    public void setPagoRealizado(boolean pagoRealizado) {
        this.pagoRealizado = pagoRealizado;
    }
}
