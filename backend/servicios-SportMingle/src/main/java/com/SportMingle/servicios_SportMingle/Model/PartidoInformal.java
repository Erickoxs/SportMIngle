package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "partidos_informales")
public class PartidoInformal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPartidoInformal;

    @ManyToOne
    @JoinColumn(name = "id_organizador", nullable = false)
    private Usuario organizador;

    @ManyToOne
    @JoinColumn(name = "id_deporte", nullable = false)
    private Deporte deporte;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "ubicacion", nullable = false, length = 255)
    private String ubicacion;

    @Column(name = "max_jugadores")
    private Integer maxJugadores;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_requerido", nullable = false)
    private NivelRequerido nivelRequerido = NivelRequerido.CUALQUIERA;

    @Column(name = "costo_participacion", precision = 10, scale = 2, nullable = false)
    private BigDecimal costoParticipacion = BigDecimal.ZERO;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private Estado estado = Estado.PLANIFICADO;

    @Enumerated(EnumType.STRING)
    @Column(name = "privacidad", nullable = false)
    private Privacidad privacidad = Privacidad.PUBLICO;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public enum NivelRequerido {
        CUALQUIERA, PRINCIPIANTE, AMATEUR, SEMIPROFESIONAL, AVANZADO
    }

    public enum Estado {
        PLANIFICADO, CONFIRMADO, COMPLETADO, CANCELADO
    }

    public enum Privacidad {
        PUBLICO, SOLO_INVITADOS, PRIVADO
    }

    // Getters y Setters

    public Long getIdPartidoInformal() {
        return idPartidoInformal;
    }

    public void setIdPartidoInformal(Long idPartidoInformal) {
        this.idPartidoInformal = idPartidoInformal;
    }

    public Usuario getOrganizador() {
        return organizador;
    }

    public void setOrganizador(Usuario organizador) {
        this.organizador = organizador;
    }

    public Deporte getDeporte() {
        return deporte;
    }

    public void setDeporte(Deporte deporte) {
        this.deporte = deporte;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public Integer getMaxJugadores() {
        return maxJugadores;
    }

    public void setMaxJugadores(Integer maxJugadores) {
        this.maxJugadores = maxJugadores;
    }

    public NivelRequerido getNivelRequerido() {
        return nivelRequerido;
    }

    public void setNivelRequerido(NivelRequerido nivelRequerido) {
        this.nivelRequerido = nivelRequerido;
    }

    public BigDecimal getCostoParticipacion() {
        return costoParticipacion;
    }

    public void setCostoParticipacion(BigDecimal costoParticipacion) {
        this.costoParticipacion = costoParticipacion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public Privacidad getPrivacidad() {
        return privacidad;
    }

    public void setPrivacidad(Privacidad privacidad) {
        this.privacidad = privacidad;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    // No setter para fechaCreacion para que sea inmutable tras creación

}
