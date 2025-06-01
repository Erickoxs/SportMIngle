package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "miembros_club")
public class MiembroClub {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_miembro")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_club", nullable = false)
    private Clubes club;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_deportista", nullable = false)
    private Usuario deportista;

    public enum Rol {
        miembro, capitan, entrenador
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol = Rol.miembro;

    @Column(name = "fecha_union", nullable = false)
    private LocalDate fechaUnion = LocalDate.now();

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;


    // Constructor vacío
    public MiembroClub() {}

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Clubes getClub() {
        return club;
    }

    public void setClub(Clubes club) {
        this.club = club;
    }

    public Usuario getDeportista() {
        return deportista;
    }

    public void setDeportista(Usuario deportista) {
        this.deportista = deportista;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public LocalDate getFechaUnion() {
        return fechaUnion;
    }

    public void setFechaUnion(LocalDate fechaUnion) {
        this.fechaUnion = fechaUnion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

}

