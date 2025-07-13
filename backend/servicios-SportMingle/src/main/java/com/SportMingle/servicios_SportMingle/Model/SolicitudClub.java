package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class SolicitudClub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuario; // quien solicita o es invitado

    @ManyToOne
    private Clubes club;

    @Enumerated(EnumType.STRING)
    private EstadoSolicitud estado; // PENDIENTE, ACEPTADA, RECHAZADA

    private boolean esInvitacion; // true si es invitación, false si es solicitud



    public enum EstadoSolicitud {
        PENDIENTE,
        ACEPTADA,
        RECHAZADA
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Clubes getClub() {
        return club;
    }

    public void setClub(Clubes club) {
        this.club = club;
    }

    public EstadoSolicitud getEstado() {
        return estado;
    }

    public void setEstado(EstadoSolicitud estado) {
        this.estado = estado;
    }

    public boolean isEsInvitacion() {
        return esInvitacion;
    }

    public void setEsInvitacion(boolean esInvitacion) {
        this.esInvitacion = esInvitacion;
    }
}


