package com.SportMingle.servicios_SportMingle.dto;

public class SolicitudClubDTO {
    private Long id;
    private String estado;
    private boolean esInvitacion;
    private String nombreUsuario; // opcional
    private ClubResponse club;

    public SolicitudClubDTO(Long id, String estado, boolean esInvitacion, String nombreUsuario, ClubResponse club) {
        this.id = id;
        this.estado = estado;
        this.esInvitacion = esInvitacion;
        this.nombreUsuario = nombreUsuario;
        this.club = club;
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public boolean isEsInvitacion() {
        return esInvitacion;
    }

    public void setEsInvitacion(boolean esInvitacion) {
        this.esInvitacion = esInvitacion;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public ClubResponse getClub() {
        return club;
    }

    public void setClub(ClubResponse club) {
        this.club = club;
    }
}
