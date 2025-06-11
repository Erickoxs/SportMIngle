package com.SportMingle.servicios_SportMingle.dto;



import java.math.BigDecimal;
import java.time.LocalDate;

public class TorneoRequest {

    private String nombre;
    private String descripcion;

    private Long idOrganizador;
    private Long idDeporte;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private Double lat;
    private Double lon;

    private Integer numeroFases;
    private String premios;
    private BigDecimal costoInscripcion;
    private Integer maxEquipos;

    private String estado; // Deberá ser uno de: "inscripciones", "en_progreso", "finalizado", "cancelado"
    private String imagenTorneo;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getIdOrganizador() {
        return idOrganizador;
    }

    public void setIdOrganizador(Long idOrganizador) {
        this.idOrganizador = idOrganizador;
    }

    public Long getIdDeporte() {
        return idDeporte;
    }

    public void setIdDeporte(Long idDeporte) {
        this.idDeporte = idDeporte;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public Integer getNumeroFases() {
        return numeroFases;
    }

    public void setNumeroFases(Integer numeroFases) {
        this.numeroFases = numeroFases;
    }

    public String getPremios() {
        return premios;
    }

    public void setPremios(String premios) {
        this.premios = premios;
    }

    public BigDecimal getCostoInscripcion() {
        return costoInscripcion;
    }

    public void setCostoInscripcion(BigDecimal costoInscripcion) {
        this.costoInscripcion = costoInscripcion;
    }

    public Integer getMaxEquipos() {
        return maxEquipos;
    }

    public void setMaxEquipos(Integer maxEquipos) {
        this.maxEquipos = maxEquipos;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getImagenTorneo() {
        return imagenTorneo;
    }

    public void setImagenTorneo(String imagenTorneo) {
        this.imagenTorneo = imagenTorneo;
    }
}
