package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "participantes_chat")
public class ParticipanteChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idParticipante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sala", nullable = false)
    private SalaChat salaChat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_union")
    private LocalDateTime fechaUnion;

    public enum Rol {
        miembro, admin, creador
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol = Rol.miembro;

    @Column(name = "notificaciones", nullable = false)
    private boolean notificaciones = true;

    @Column(name = "ultima_vista")
    private LocalDateTime ultimaVista;

    public ParticipanteChat() {
        this.fechaUnion = LocalDateTime.now();
    }

    // Getters y setters

    public Long getIdParticipante() {
        return idParticipante;
    }

    public void setIdParticipante(Long idParticipante) {
        this.idParticipante = idParticipante;
    }

    public SalaChat getSalaChat() {
        return salaChat;
    }

    public void setSalaChat(SalaChat salaChat) {
        this.salaChat = salaChat;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaUnion() {
        return fechaUnion;
    }

    public void setFechaUnion(LocalDateTime fechaUnion) {
        this.fechaUnion = fechaUnion;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public boolean isNotificaciones() {
        return notificaciones;
    }

    public void setNotificaciones(boolean notificaciones) {
        this.notificaciones = notificaciones;
    }

    public LocalDateTime getUltimaVista() {
        return ultimaVista;
    }

    public void setUltimaVista(LocalDateTime ultimaVista) {
        this.ultimaVista = ultimaVista;
    }
}
