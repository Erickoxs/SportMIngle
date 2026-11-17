package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.MiembroClub;
import com.SportMingle.servicios_SportMingle.Model.SolicitudClub;
import com.SportMingle.servicios_SportMingle.Model.SolicitudClub.EstadoSolicitud;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.MiembroRepository;
import com.SportMingle.servicios_SportMingle.Repository.SolicitudClubRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SolicitudClubService — lógica de inscripción a clubes")
class SolicitudClubServiceTest {

    @Mock
    private SolicitudClubRepository repo;

    @Mock
    private MiembroRepository miembroRepo;

    @InjectMocks
    private SolicitudClubService service;

    private static final Long ID_USUARIO = 10L;
    private static final Long ID_CLUB = 20L;
    private static final Long ID_SOLICITUD = 99L;

    // ─── solicitarIngreso ───────────────────────────────────────────────────────

    @Test
    @DisplayName("solicitarIngreso() — crea solicitud cuando el usuario no es miembro ni tiene solicitud pendiente")
    void solicitarIngreso_creaCorrectamente() {
        when(miembroRepo.existsByDeportistaIdUsuarioAndClubId(ID_USUARIO, ID_CLUB)).thenReturn(false);
        when(repo.existsByUsuario_IdUsuarioAndClub_IdAndEstado(ID_USUARIO, ID_CLUB, EstadoSolicitud.PENDIENTE))
                .thenReturn(false);

        service.solicitarIngreso(ID_USUARIO, ID_CLUB);

        ArgumentCaptor<SolicitudClub> captor = ArgumentCaptor.forClass(SolicitudClub.class);
        verify(repo).save(captor.capture());

        SolicitudClub guardada = captor.getValue();
        assertThat(guardada.getEstado()).isEqualTo(EstadoSolicitud.PENDIENTE);
        assertThat(guardada.isEsInvitacion()).isFalse();
        assertThat(guardada.getUsuario().getIdUsuario()).isEqualTo(ID_USUARIO);
        assertThat(guardada.getClub().getId()).isEqualTo(ID_CLUB);
    }

    @Test
    @DisplayName("solicitarIngreso() — lanza 400 si el usuario ya es miembro del club")
    void solicitarIngreso_lanzaExcepcionSiYaEsMiembro() {
        when(miembroRepo.existsByDeportistaIdUsuarioAndClubId(ID_USUARIO, ID_CLUB)).thenReturn(true);

        assertThatThrownBy(() -> service.solicitarIngreso(ID_USUARIO, ID_CLUB))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Ya estás inscrito");

        verify(repo, never()).save(any());
    }

    @Test
    @DisplayName("solicitarIngreso() — lanza 400 si ya existe una solicitud pendiente")
    void solicitarIngreso_lanzaExcepcionSiYaTieneSolicitudPendiente() {
        when(miembroRepo.existsByDeportistaIdUsuarioAndClubId(ID_USUARIO, ID_CLUB)).thenReturn(false);
        when(repo.existsByUsuario_IdUsuarioAndClub_IdAndEstado(ID_USUARIO, ID_CLUB, EstadoSolicitud.PENDIENTE))
                .thenReturn(true);

        assertThatThrownBy(() -> service.solicitarIngreso(ID_USUARIO, ID_CLUB))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("solicitud pendiente");

        verify(repo, never()).save(any());
    }

    // ─── aceptar ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("aceptar() — cambia estado a ACEPTADA y crea MiembroClub")
    void aceptar_cambiaEstadoYCreaMiembro() {
        SolicitudClub solicitud = solicitudFake(EstadoSolicitud.PENDIENTE, false);
        when(repo.findById(ID_SOLICITUD)).thenReturn(Optional.of(solicitud));

        service.aceptar(ID_SOLICITUD);

        assertThat(solicitud.getEstado()).isEqualTo(EstadoSolicitud.ACEPTADA);
        verify(repo).save(solicitud);
        verify(miembroRepo).save(any(MiembroClub.class));
    }

    @Test
    @DisplayName("aceptar() — lanza excepción si la solicitud no existe")
    void aceptar_lanzaExcepcionSiNoExiste() {
        when(repo.findById(ID_SOLICITUD)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.aceptar(ID_SOLICITUD))
                .isInstanceOf(RuntimeException.class);
    }

    // ─── rechazar ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("rechazar() — cambia estado a RECHAZADA sin crear miembro")
    void rechazar_cambiaEstadoArechazada() {
        SolicitudClub solicitud = solicitudFake(EstadoSolicitud.PENDIENTE, false);
        when(repo.findById(ID_SOLICITUD)).thenReturn(Optional.of(solicitud));

        service.rechazar(ID_SOLICITUD);

        assertThat(solicitud.getEstado()).isEqualTo(EstadoSolicitud.RECHAZADA);
        verify(repo).save(solicitud);
        verifyNoInteractions(miembroRepo);
    }

    // ─── invitarUsuario ────────────────────────────────────────────────────────

    @Test
    @DisplayName("invitarUsuario() — crea solicitud con esInvitacion=true")
    void invitarUsuario_marcaEsInvitacion() {
        service.invitarUsuario(ID_CLUB, ID_USUARIO);

        ArgumentCaptor<SolicitudClub> captor = ArgumentCaptor.forClass(SolicitudClub.class);
        verify(repo).save(captor.capture());

        assertThat(captor.getValue().isEsInvitacion()).isTrue();
        assertThat(captor.getValue().getEstado()).isEqualTo(EstadoSolicitud.PENDIENTE);
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private SolicitudClub solicitudFake(EstadoSolicitud estado, boolean esInvitacion) {
        SolicitudClub s = new SolicitudClub();
        s.setId(ID_SOLICITUD);
        s.setEstado(estado);
        s.setEsInvitacion(esInvitacion);
        Usuario u = new Usuario();
        u.setIdUsuario(ID_USUARIO);
        s.setUsuario(u);
        return s;
    }
}
