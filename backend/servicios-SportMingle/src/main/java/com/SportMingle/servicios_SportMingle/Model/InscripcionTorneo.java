package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones_torneo")
public class InscripcionTorneo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInscripcion;

    @ManyToOne
    @JoinColumn(name = "id_torneo", nullable = false)
    private Torneo torneo;

    @ManyToOne
    @JoinColumn(name = "id_equipo", nullable = false)
    private Clubes clubes;

    @Column(name = "fecha_inscripcion", nullable = false)
    private LocalDateTime fechaInscripcion = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoInscripcion estado = EstadoInscripcion.PENDIENTE;

    @Column(name = "motivo_rechazo")
    private String motivoRechazo;

    @Column(name = "pago_realizado", nullable = false)
    private boolean pagoRealizado = false;

    // Enum para estado
    public enum EstadoInscripcion {
        PENDIENTE, ACEPTADA, RECHAZADA, RETIRADA
    }

    // Getters y setters

    public Long getIdInscripcion() {
        return idInscripcion;
    }

    public void setIdInscripcion(Long idInscripcion) {
        this.idInscripcion = idInscripcion;
    }

    public Torneo getTorneo() {
        return torneo;
    }

    public void setTorneo(Torneo torneo) {
        this.torneo = torneo;
    }

    public Clubes getClubes() {
        return clubes;
    }

    public void setClubes(Clubes clubes) {
        this.clubes = clubes;
    }

    public LocalDateTime getFechaInscripcion() {
        return fechaInscripcion;
    }

    public void setFechaInscripcion(LocalDateTime fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }

    public EstadoInscripcion getEstado() {
        return estado;
    }

    public void setEstado(EstadoInscripcion estado) {
        this.estado = estado;
    }

    public String getMotivoRechazo() {
        return motivoRechazo;
    }

    public void setMotivoRechazo(String motivoRechazo) {
        this.motivoRechazo = motivoRechazo;
    }

    public boolean isPagoRealizado() {
        return pagoRealizado;
    }

    public void setPagoRealizado(boolean pagoRealizado) {
        this.pagoRealizado = pagoRealizado;
    }
}
