package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "jugadores_partidos_informales")
public class JugadorPartidoInformal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInscripcion;

    @ManyToOne
    @JoinColumn(name = "id_partido_informal", nullable = false)
    private PartidoInformal partidoInformal;

    @ManyToOne
    @JoinColumn(name = "id_jugador", nullable = false)
    private Deportistas jugador;

    @Column(name = "posicion", length = 50)
    private String posicion;

    @Column(name = "calificacion_organizador")
    private Integer calificacionOrganizador; // 1-5

    @Column(name = "feedback_organizador", columnDefinition = "TEXT")
    private String feedbackOrganizador;

    // Getters y Setters

    public Long getIdInscripcion() {
        return idInscripcion;
    }

    public void setIdInscripcion(Long idInscripcion) {
        this.idInscripcion = idInscripcion;
    }

    public PartidoInformal getPartidoInformal() {
        return partidoInformal;
    }

    public void setPartidoInformal(PartidoInformal partidoInformal) {
        this.partidoInformal = partidoInformal;
    }

    public Deportistas getJugador() {
        return jugador;
    }

    public void setJugador(Deportistas jugador) {
        this.jugador = jugador;
    }

    public String getPosicion() {
        return posicion;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }

    public Integer getCalificacionOrganizador() {
        return calificacionOrganizador;
    }

    public void setCalificacionOrganizador(Integer calificacionOrganizador) {
        this.calificacionOrganizador = calificacionOrganizador;
    }

    public String getFeedbackOrganizador() {
        return feedbackOrganizador;
    }

    public void setFeedbackOrganizador(String feedbackOrganizador) {
        this.feedbackOrganizador = feedbackOrganizador;
    }
}
