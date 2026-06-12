package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;

@Entity
@Table(name = "partidos")
public class PartidoInformal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPartido;

    @ManyToOne
    @JoinColumn(name = "id_organizador", nullable = false)
    private Usuario organizador;

    @ManyToOne
    @JoinColumn(name = "id_deporte", nullable = false)
    private Deporte deporte;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(columnDefinition = "geography(Point,4326)", nullable = false)
    private Point ubicacion;

    @Column(name = "max_jugadores")
    private Integer maxJugadores;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_requerido", nullable = false)
    private NivelRequerido nivelRequerido = NivelRequerido.CUALQUIERA;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;


    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public enum NivelRequerido {
        CUALQUIERA, PRINCIPIANTE, AMATEUR, SEMIPROFESIONAL, AVANZADO
    }


    // Getters y Setters

    public Long getIdPartido() {
        return idPartido;
    }

    public void setIdPartido(Long idPartido) {
        this.idPartido = idPartido;
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

    public Point getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(Point ubicacion) {
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    // No setter para fechaCreacion para que sea inmutable tras creación

}
