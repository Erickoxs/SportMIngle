package com.SportMingle.servicios_SportMingle.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "partidos_torneo")
public class PartidoTorneo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPartido;

    @ManyToOne
    @JoinColumn(name = "id_torneo")
    @JsonIgnoreProperties({"ubicacion", "organizador"})
    private Torneo torneo;

    @ManyToOne
    @JoinColumn(name = "id_equipo_local", nullable = false)
    @JsonIgnoreProperties({"ubicacion", "administrador"})
    private Clubes equipoLocal;

    @ManyToOne
    @JoinColumn(name = "id_equipo_visitante", nullable = false)
    @JsonIgnoreProperties({"ubicacion", "administrador"})
    private Clubes equipoVisitante;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoPartido estado = EstadoPartido.PROGRAMADO;

    @Column(name = "resultado_local")
    private Integer resultadoLocal;

    @Column(name = "resultado_visitante")
    private Integer resultadoVisitante;

    @Column(name = "detalles", columnDefinition = "TEXT")
    private String detalles;

    @Column(name = "fase_torneo", length = 50)
    private String faseTorneo;

    public enum EstadoPartido {
        PROGRAMADO, EN_JUEGO, FINALIZADO
    }

    // Getters y Setters

    public Long getIdPartido() {
        return idPartido;
    }

    public void setIdPartido(Long idPartido) {
        this.idPartido = idPartido;
    }

    public Torneo getTorneo() {
        return torneo;
    }

    public void setTorneo(Torneo torneo) {
        this.torneo = torneo;
    }

    public Clubes getEquipoLocal() {
        return equipoLocal;
    }

    public void setEquipoLocal(Clubes equipoLocal) {
        this.equipoLocal = equipoLocal;
    }

    public Clubes getEquipoVisitante() {
        return equipoVisitante;
    }

    public void setEquipoVisitante(Clubes equipoVisitante) {
        this.equipoVisitante = equipoVisitante;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public EstadoPartido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPartido estado) {
        this.estado = estado;
    }

    public Integer getResultadoLocal() {
        return resultadoLocal;
    }

    public void setResultadoLocal(Integer resultadoLocal) {
        this.resultadoLocal = resultadoLocal;
    }

    public Integer getResultadoVisitante() {
        return resultadoVisitante;
    }

    public void setResultadoVisitante(Integer resultadoVisitante) {
        this.resultadoVisitante = resultadoVisitante;
    }

    public String getDetalles() {
        return detalles;
    }

    public void setDetalles(String detalles) {
        this.detalles = detalles;
    }

    public String getFaseTorneo() {
        return faseTorneo;
    }

    public void setFaseTorneo(String faseTorneo) {
        this.faseTorneo = faseTorneo;
    }
}
