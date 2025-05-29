package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import org.springframework.boot.autoconfigure.web.WebProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Deportistas")
public class Deportistas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false)

    private Usuario idUsuario;

    @Column(name = "deporte_principal", nullable = false)

    private String deporte;

    @Column(name = "Posicion", nullable = true)
    private String posicion;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel", nullable = false)
    private NivelJugador nivel;


    public enum NivelJugador {
        principiante, amateur, semiprofesional, avanzado
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Usuario getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Usuario idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getDeporte() {
        return deporte;
    }

    public void setDeporte(String deporte) {
        this.deporte = deporte;
    }

    public String getPosicion() {
        return posicion;
    }

    public void setPosicion(String posicion) {
        this.posicion = posicion;
    }

    public NivelJugador getNivel() {
        return nivel;
    }

    public void setNivel(NivelJugador nivel) {
        this.nivel = nivel;
    }
}
