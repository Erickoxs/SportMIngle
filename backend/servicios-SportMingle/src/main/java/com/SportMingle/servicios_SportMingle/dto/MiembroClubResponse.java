package com.SportMingle.servicios_SportMingle.dto;

import com.SportMingle.servicios_SportMingle.Model.MiembroClub;

public class MiembroClubResponse {

    private Long id;
    private String nombreDeportista;
    private MiembroClub.Rol rol;
    private boolean activo;

    public MiembroClubResponse(MiembroClub miembro) {
        this.id = miembro.getId();
        this.nombreDeportista = miembro.getDeportista().getNombre(); // Asegúrate de que no sea null
        this.rol = miembro.getRol();
        this.activo = miembro.getActivo();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getNombreDeportista() {
        return nombreDeportista;
    }

    public MiembroClub.Rol getRol() {
        return rol;
    }

    public boolean isActivo() {
        return activo;
    }
}
