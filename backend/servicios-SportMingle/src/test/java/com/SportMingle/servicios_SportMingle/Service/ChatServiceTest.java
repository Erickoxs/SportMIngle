package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.*;
import com.SportMingle.servicios_SportMingle.Repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ChatService — mensajería y notificaciones")
class ChatServiceTest {

    @Mock private MensajeChatRepository mensajeRepo;
    @Mock private UsuarioRepository usuarioRepo;
    @Mock private NotificacionRepository notificacionRepo;
    @Mock private MensajeEliminadoRepository mensajeEliminadoRepo;
    @Mock private SalaChatRepository salaChatRepo;
    @Mock private ParticipanteChatRepository participanteChatRepo;

    @InjectMocks
    private ChatService service;

    private static final Long ID_REMITENTE = 1L;
    private static final Long ID_SALA      = 10L;
    private static final Long ID_MENSAJE   = 100L;

    // ─── enviarMensaje ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("enviarMensaje() — guarda el mensaje con los datos correctos")
    void enviarMensaje_guardaMensajeCorrectamente() {
        Usuario remitente = usuarioFake(ID_REMITENTE);
        SalaChat sala = salaFake(ID_SALA);
        MensajeChat mensajeGuardado = mensajeFake(ID_MENSAJE, remitente, sala, "Hola!");

        when(usuarioRepo.findById(ID_REMITENTE)).thenReturn(Optional.of(remitente));
        when(salaChatRepo.findById(ID_SALA)).thenReturn(Optional.of(sala));
        when(mensajeRepo.save(any(MensajeChat.class))).thenReturn(mensajeGuardado);
        when(participanteChatRepo.findBySalaChatIdSala(ID_SALA)).thenReturn(List.of());

        MensajeChat resultado = service.enviarMensaje(ID_REMITENTE, ID_SALA, "Hola!");

        assertThat(resultado.getContenido()).isEqualTo("Hola!");
        assertThat(resultado.getUsuario().getIdUsuario()).isEqualTo(ID_REMITENTE);

        ArgumentCaptor<MensajeChat> captor = ArgumentCaptor.forClass(MensajeChat.class);
        verify(mensajeRepo).save(captor.capture());
        assertThat(captor.getValue().isLeido()).isFalse();
        assertThat(captor.getValue().getTipo()).isEqualTo(MensajeChat.Tipo.texto);
    }

    @Test
    @DisplayName("enviarMensaje() — crea notificación para participantes con notificaciones activas")
    void enviarMensaje_creaNotificacionParaOtrosParticipantes() {
        Usuario remitente = usuarioFake(ID_REMITENTE);
        Usuario otroUsuario = usuarioFake(2L);
        SalaChat sala = salaFake(ID_SALA);

        ParticipanteChat participanteOtro = participanteFake(otroUsuario, true);
        MensajeChat mensajeGuardado = mensajeFake(ID_MENSAJE, remitente, sala, "Hey");

        when(usuarioRepo.findById(ID_REMITENTE)).thenReturn(Optional.of(remitente));
        when(salaChatRepo.findById(ID_SALA)).thenReturn(Optional.of(sala));
        when(mensajeRepo.save(any())).thenReturn(mensajeGuardado);
        when(participanteChatRepo.findBySalaChatIdSala(ID_SALA))
                .thenReturn(List.of(participanteOtro));

        service.enviarMensaje(ID_REMITENTE, ID_SALA, "Hey");

        verify(notificacionRepo, times(1)).save(any(Notificacion.class));
    }

    @Test
    @DisplayName("enviarMensaje() — NO crea notificación para participantes con notificaciones desactivadas")
    void enviarMensaje_noNotificaSiNotificacionesDesactivadas() {
        Usuario remitente = usuarioFake(ID_REMITENTE);
        Usuario otroUsuario = usuarioFake(2L);
        SalaChat sala = salaFake(ID_SALA);

        ParticipanteChat participanteSinNoti = participanteFake(otroUsuario, false); // notificaciones=false
        MensajeChat mensajeGuardado = mensajeFake(ID_MENSAJE, remitente, sala, "Hey");

        when(usuarioRepo.findById(ID_REMITENTE)).thenReturn(Optional.of(remitente));
        when(salaChatRepo.findById(ID_SALA)).thenReturn(Optional.of(sala));
        when(mensajeRepo.save(any())).thenReturn(mensajeGuardado);
        when(participanteChatRepo.findBySalaChatIdSala(ID_SALA))
                .thenReturn(List.of(participanteSinNoti));

        service.enviarMensaje(ID_REMITENTE, ID_SALA, "Hey");

        verifyNoInteractions(notificacionRepo);
    }

    @Test
    @DisplayName("enviarMensaje() — NO notifica al propio remitente aunque tenga notificaciones activas")
    void enviarMensaje_noNotificaAlRemitente() {
        Usuario remitente = usuarioFake(ID_REMITENTE);
        SalaChat sala = salaFake(ID_SALA);

        // El remitente también aparece como participante de su propia sala
        ParticipanteChat participanteRemitente = participanteFake(remitente, true);
        MensajeChat mensajeGuardado = mensajeFake(ID_MENSAJE, remitente, sala, "Solo yo");

        when(usuarioRepo.findById(ID_REMITENTE)).thenReturn(Optional.of(remitente));
        when(salaChatRepo.findById(ID_SALA)).thenReturn(Optional.of(sala));
        when(mensajeRepo.save(any())).thenReturn(mensajeGuardado);
        when(participanteChatRepo.findBySalaChatIdSala(ID_SALA))
                .thenReturn(List.of(participanteRemitente));

        service.enviarMensaje(ID_REMITENTE, ID_SALA, "Solo yo");

        verifyNoInteractions(notificacionRepo);
    }

    @Test
    @DisplayName("enviarMensaje() — lanza excepción si el remitente no existe")
    void enviarMensaje_lanzaExcepcionSiRemitenteNoExiste() {
        when(usuarioRepo.findById(ID_REMITENTE)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.enviarMensaje(ID_REMITENTE, ID_SALA, "Hola"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Remitente no encontrado");
    }

    @Test
    @DisplayName("enviarMensaje() — lanza excepción si la sala no existe")
    void enviarMensaje_lanzaExcepcionSiSalaNoExiste() {
        when(usuarioRepo.findById(ID_REMITENTE)).thenReturn(Optional.of(usuarioFake(ID_REMITENTE)));
        when(salaChatRepo.findById(ID_SALA)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.enviarMensaje(ID_REMITENTE, ID_SALA, "Hola"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Sala de chat no encontrada");
    }

    // ─── obtenerMensajesDeSala ─────────────────────────────────────────────────

    @Test
    @DisplayName("obtenerMensajesDeSala() — delega al repositorio y retorna lista ordenada")
    void obtenerMensajesDeSala_retornaListaDelRepositorio() {
        List<MensajeChat> mensajes = List.of(new MensajeChat(), new MensajeChat());
        when(mensajeRepo.findBySalaChat_IdSalaOrderByFechaEnvioAsc(ID_SALA)).thenReturn(mensajes);

        List<MensajeChat> resultado = service.obtenerMensajesDeSala(ID_SALA);

        assertThat(resultado).hasSize(2);
        verify(mensajeRepo).findBySalaChat_IdSalaOrderByFechaEnvioAsc(ID_SALA);
    }

    // ─── eliminarMensajeParaUsuario ────────────────────────────────────────────

    @Test
    @DisplayName("eliminarMensajeParaUsuario() — crea registro MensajeEliminado con la razón correcta")
    void eliminarMensaje_creaRegistroConRazonCorrecta() {
        MensajeChat mensaje = mensajeFake(ID_MENSAJE, usuarioFake(ID_REMITENTE), salaFake(ID_SALA), "texto");
        Usuario usuario = usuarioFake(ID_REMITENTE);

        when(mensajeRepo.findById(ID_MENSAJE)).thenReturn(Optional.of(mensaje));
        when(usuarioRepo.findById(ID_REMITENTE)).thenReturn(Optional.of(usuario));

        service.eliminarMensajeParaUsuario(ID_MENSAJE, ID_REMITENTE, MensajeEliminado.Razon.usuario);

        ArgumentCaptor<MensajeEliminado> captor = ArgumentCaptor.forClass(MensajeEliminado.class);
        verify(mensajeEliminadoRepo).save(captor.capture());
        assertThat(captor.getValue().getRazon()).isEqualTo(MensajeEliminado.Razon.usuario);
        assertThat(captor.getValue().getMensaje()).isEqualTo(mensaje);
    }

    @Test
    @DisplayName("eliminarMensajeParaUsuario() — lanza excepción si el mensaje no existe")
    void eliminarMensaje_lanzaExcepcionSiMensajeNoExiste() {
        when(mensajeRepo.findById(ID_MENSAJE)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                service.eliminarMensajeParaUsuario(ID_MENSAJE, ID_REMITENTE, MensajeEliminado.Razon.admin))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Mensaje no encontrado");
    }

    // ─── contarMensajesNoLeidos ────────────────────────────────────────────────

    @Test
    @DisplayName("contarMensajesNoLeidos() — usa LocalDateTime.MIN si ultimaVista es null")
    void contarMensajesNoLeidos_usaMinSiUltimaVistaEsNull() {
        ParticipanteChat participante = participanteFake(usuarioFake(ID_REMITENTE), true);
        participante.setUltimaVista(null); // sin última vista registrada

        when(participanteChatRepo.findBySalaChat_IdSalaAndUsuario_IdUsuario(ID_SALA, ID_REMITENTE))
                .thenReturn(Optional.of(participante));
        when(mensajeRepo.countBySalaChat_IdSalaAndFechaEnvioAfterAndUsuario_IdUsuarioNot(
                eq(ID_SALA), eq(LocalDateTime.MIN), eq(ID_REMITENTE)))
                .thenReturn(5L);

        long resultado = service.contarMensajesNoLeidos(ID_REMITENTE, ID_SALA);

        assertThat(resultado).isEqualTo(5L);
    }

    @Test
    @DisplayName("contarMensajesNoLeidos() — lanza excepción si el participante no existe en la sala")
    void contarMensajesNoLeidos_lanzaExcepcionSiParticipanteNoExiste() {
        when(participanteChatRepo.findBySalaChat_IdSalaAndUsuario_IdUsuario(ID_SALA, ID_REMITENTE))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.contarMensajesNoLeidos(ID_REMITENTE, ID_SALA))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Participante no encontrado");
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private Usuario usuarioFake(Long id) {
        Usuario u = new Usuario();
        u.setIdUsuario(id);
        u.setNombre("Usuario " + id);
        return u;
    }

    private SalaChat salaFake(Long id) {
        SalaChat s = new SalaChat();
        s.setIdSala(id);
        s.setNombreSala("Sala " + id);
        return s;
    }

    private MensajeChat mensajeFake(Long id, Usuario usuario, SalaChat sala, String contenido) {
        MensajeChat m = new MensajeChat();
        m.setIdMensaje(id);
        m.setUsuario(usuario);
        m.setSalaChat(sala);
        m.setContenido(contenido);
        m.setLeido(false);
        m.setTipo(MensajeChat.Tipo.texto);
        return m;
    }

    private ParticipanteChat participanteFake(Usuario usuario, boolean notificaciones) {
        ParticipanteChat p = new ParticipanteChat();
        p.setUsuario(usuario);
        p.setNotificaciones(notificaciones);
        return p;
    }
}
