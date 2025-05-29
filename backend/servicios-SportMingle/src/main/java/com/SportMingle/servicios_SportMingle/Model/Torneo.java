package com.SportMingle.servicios_SportMingle.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "torneos")
public class Torneo {

    public enum FormatoTorneo {
        liga, eliminacion, grupos_eliminacion, otros
    }

    public enum EstadoTorneo {
        planificado, inscripciones, en_progreso, finalizado, cancelado
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_torneo")
    private Long id;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    // Referencia a Usuario organizador
    @ManyToOne
    @JoinColumn(name = "id_organizador", nullable = false)
    private Usuario organizador;

    // Referencia a Deporte
    @ManyToOne
    @JoinColumn(name = "id_deporte", nullable = false)
    private Deporte deporte;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "ubicacion", length = 255, nullable = false)
    private String ubicacion;

    @Column(name = "numero_fases")
    private Integer numeroFases; // máximo 3 fases (puedes validar en lógica de negocio)

    @Enumerated(EnumType.STRING)
    @Column(name = "formato_torneo")
    private FormatoTorneo formatoTorneo;

    @Column(name = "reglas", columnDefinition = "TEXT")
    private String reglas;

    @Column(name = "premios", columnDefinition = "TEXT")
    private String premios;

    @Column(name = "costo_inscripcion", precision = 10, scale = 2)
    private BigDecimal costoInscripcion;

    @Column(name = "max_equipos")
    private Integer maxEquipos;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoTorneo estado = EstadoTorneo.planificado;

    @Column(name = "imagen_torneo", length = 255)
    private String imagenTorneo;

    @Column(name = "fecha_creacion", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", updatable = false)
    private LocalDateTime fechaCreacion;

    // Constructor vacío
    public Torneo() {}

    // Getters y setters...


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Usuario getOrganizador() {
        return organizador;
    }

    public void setOrganizador(Usuario organizador) {
        this.organizador = organizador;
    }

    public Deporte getDeporte() {
        return deporte;
    }

    public void setDeporte(Deporte deporte) {
        this.deporte = deporte;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public Integer getNumeroFases() {
        return numeroFases;
    }

    public void setNumeroFases(Integer numeroFases) {
        this.numeroFases = numeroFases;
    }

    public FormatoTorneo getFormatoTorneo() {
        return formatoTorneo;
    }

    public void setFormatoTorneo(FormatoTorneo formatoTorneo) {
        this.formatoTorneo = formatoTorneo;
    }

    public String getReglas() {
        return reglas;
    }

    public void setReglas(String reglas) {
        this.reglas = reglas;
    }

    public String getPremios() {
        return premios;
    }

    public void setPremios(String premios) {
        this.premios = premios;
    }

    public BigDecimal getCostoInscripcion() {
        return costoInscripcion;
    }

    public void setCostoInscripcion(BigDecimal costoInscripcion) {
        this.costoInscripcion = costoInscripcion;
    }

    public Integer getMaxEquipos() {
        return maxEquipos;
    }

    public void setMaxEquipos(Integer maxEquipos) {
        this.maxEquipos = maxEquipos;
    }

    public EstadoTorneo getEstado() {
        return estado;
    }

    public void setEstado(EstadoTorneo estado) {
        this.estado = estado;
    }

    public String getImagenTorneo() {
        return imagenTorneo;
    }

    public void setImagenTorneo(String imagenTorneo) {
        this.imagenTorneo = imagenTorneo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
