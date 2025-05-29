package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_eliminados")
public class MensajeEliminado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mensaje", nullable = false)
    private MensajeChat mensaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_eliminacion", nullable = false)
    private LocalDateTime fechaEliminacion = LocalDateTime.now();

    public enum Razon {
        usuario,
        admin,
        automatico
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "razon", nullable = false)
    private Razon razon;

    public MensajeEliminado() {
        this.fechaEliminacion = LocalDateTime.now();
    }

    // Getters y setters

    public Long getIdRegistro() {
        return idRegistro;
    }

    public void setIdRegistro(Long idRegistro) {
        this.idRegistro = idRegistro;
    }

    public MensajeChat getMensaje() {
        return mensaje;
    }

    public void setMensaje(MensajeChat mensaje) {
        this.mensaje = mensaje;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaEliminacion() {
        return fechaEliminacion;
    }

    public void setFechaEliminacion(LocalDateTime fechaEliminacion) {
        this.fechaEliminacion = fechaEliminacion;
    }

    public Razon getRazon() {
        return razon;
    }

    public void setRazon(Razon razon) {
        this.razon = razon;
    }
}
