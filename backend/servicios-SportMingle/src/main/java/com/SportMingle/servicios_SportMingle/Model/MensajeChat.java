package com.SportMingle.servicios_SportMingle.Model;

import com.SportMingle.servicios_SportMingle.Config.JsonNodeConverter;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_chat")
public class MensajeChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMensaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sala", nullable = false)
    private SalaChat salaChat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "fecha_envio", nullable = false)
    private LocalDateTime fechaEnvio = LocalDateTime.now();

    @Column(name = "leido", nullable = false)
    private boolean leido = false;

    public enum Tipo {
        texto, imagen, video, documento, enlace
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private Tipo tipo = Tipo.texto;

    @Column(name = "metadata")
    @Convert(converter = JsonNodeConverter.class)
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode metadata;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mensaje_respuesta")
    private MensajeChat mensajeRespuesta;

    // Constructor
    public MensajeChat() {
        this.fechaEnvio = LocalDateTime.now();
        this.leido = false;
        this.tipo = Tipo.texto;
    }

    // Getters y setters

    public Long getIdMensaje() {
        return idMensaje;
    }

    public void setIdMensaje(Long idMensaje) {
        this.idMensaje = idMensaje;
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

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public boolean isLeido() {
        return leido;
    }

    public void setLeido(boolean leido) {
        this.leido = leido;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public JsonNode getMetadata() {
        return metadata;
    }

    public void setMetadata(JsonNode metadata) {
        this.metadata = metadata;
    }

    public MensajeChat getMensajeRespuesta() {
        return mensajeRespuesta;
    }

    public void setMensajeRespuesta(MensajeChat mensajeRespuesta) {
        this.mensajeRespuesta = mensajeRespuesta;
    }
}
