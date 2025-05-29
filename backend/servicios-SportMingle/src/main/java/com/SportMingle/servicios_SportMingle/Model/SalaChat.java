package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "salas_chat")
public class SalaChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSala;

    @Column(name = "nombre_sala", length = 100)
    private String nombreSala;

    public enum TipoSala {
        privado, grupo, partido, torneo, club
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sala", nullable = false)
    private TipoSala tipoSala;

    @Column(name = "id_referencia")
    private Long idReferencia; // ID del elemento relacionado (partido, torneo, club, etc.)

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "ultimo_mensaje")
    private LocalDateTime ultimoMensaje;

    @Column(name = "imagen_sala", length = 255)
    private String imagenSala;

    public SalaChat() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // Getters y setters

    public Long getIdSala() {
        return idSala;
    }

    public void setIdSala(Long idSala) {
        this.idSala = idSala;
    }

    public String getNombreSala() {
        return nombreSala;
    }

    public void setNombreSala(String nombreSala) {
        this.nombreSala = nombreSala;
    }

    public TipoSala getTipoSala() {
        return tipoSala;
    }

    public void setTipoSala(TipoSala tipoSala) {
        this.tipoSala = tipoSala;
    }

    public Long getIdReferencia() {
        return idReferencia;
    }

    public void setIdReferencia(Long idReferencia) {
        this.idReferencia = idReferencia;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getUltimoMensaje() {
        return ultimoMensaje;
    }

    public void setUltimoMensaje(LocalDateTime ultimoMensaje) {
        this.ultimoMensaje = ultimoMensaje;
    }

    public String getImagenSala() {
        return imagenSala;
    }

    public void setImagenSala(String imagenSala) {
        this.imagenSala = imagenSala;
    }
}
