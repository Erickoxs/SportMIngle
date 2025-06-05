package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.*;
import com.SportMingle.servicios_SportMingle.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final MensajeChatRepository mensajeRepo;
    private final UsuarioRepository usuarioRepo;
    private final NotificacionRepository notificacionRepo;
    private final MensajeEliminadoRepository mensajeEliminadoRepo;
    private final SalaChatRepository salaChatRepo;
    private final ParticipanteChatRepository participanteChatRepo;

    public ChatService(
            MensajeChatRepository mensajeRepo,
            UsuarioRepository usuarioRepo,
            NotificacionRepository notificacionRepo,
            MensajeEliminadoRepository mensajeEliminadoRepo,
            SalaChatRepository salaChatRepo,
            ParticipanteChatRepository participanteChatRepo
    ) {
        this.mensajeRepo = mensajeRepo;
        this.usuarioRepo = usuarioRepo;
        this.notificacionRepo = notificacionRepo;
        this.mensajeEliminadoRepo = mensajeEliminadoRepo;
        this.salaChatRepo = salaChatRepo;
        this.participanteChatRepo = participanteChatRepo;
    }

    @Transactional
    public MensajeChat enviarMensaje(Long idRemitente, Long idSala, String contenido) {
        Usuario remitente = usuarioRepo.findById(idRemitente)
                .orElseThrow(() -> new RuntimeException("Remitente no encontrado"));
        SalaChat salaChat = salaChatRepo.findById(idSala)
                .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));

        MensajeChat mensaje = new MensajeChat();
        mensaje.setUsuario(remitente);
        mensaje.setSalaChat(salaChat);
        mensaje.setContenido(contenido);
        mensaje.setFechaEnvio(LocalDateTime.now());
        mensaje.setLeido(false);
        mensaje.setTipo(MensajeChat.Tipo.texto); // Por defecto

        MensajeChat mensajeGuardado = mensajeRepo.save(mensaje);

        // Crear notificación para todos los participantes excepto el remitente
        List<ParticipanteChat> participantes = participanteChatRepo.findBySalaChatIdSala(idSala);
        for (ParticipanteChat participante : participantes) {
            Usuario usuario = participante.getUsuario();
            if (!usuario.getIdUsuario().equals(remitente.getIdUsuario()) && participante.isNotificaciones()) {
                Notificacion noti = new Notificacion();
                noti.setUsuario(usuario);
                noti.setTipo(Notificacion.TipoNotificacion.MENSAJE);
                noti.setContenido("Nuevo mensaje en la sala de chat");
                noti.setIdReferencia(mensajeGuardado.getIdMensaje());
                noti.setFechaNotificacion(LocalDateTime.now());
                noti.setLeida(false);
                notificacionRepo.save(noti);
            }
        }

        return mensajeGuardado;
    }

    public List<MensajeChat> obtenerMensajesDeSala(Long idSala) {
        return mensajeRepo.findBySalaChat_IdSalaOrderByFechaEnvioAsc(idSala);
    }

    public void eliminarMensajeParaUsuario(Long idMensaje, Long idUsuario, MensajeEliminado.Razon razon) {
        MensajeChat mensaje = mensajeRepo.findById(idMensaje)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        Usuario usuario = usuarioRepo.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MensajeEliminado eliminado = new MensajeEliminado();
        eliminado.setMensaje(mensaje);
        eliminado.setUsuario(usuario);
        eliminado.setRazon(razon);
        eliminado.setFechaEliminacion(LocalDateTime.now());

        mensajeEliminadoRepo.save(eliminado);
    }

    @Transactional
    public void actualizarUltimaVista(Long idUsuario, Long idSala) {
        ParticipanteChat participante = participanteChatRepo.findBySalaChat_IdSalaAndUsuario_IdUsuario(idSala, idUsuario)
                .orElseThrow(() -> new RuntimeException("Participante no encontrado en esta sala"));

        participante.setUltimaVista(LocalDateTime.now());
        participanteChatRepo.save(participante);
    }
    public long contarMensajesNoLeidos(Long idUsuario, Long idSala) {
        ParticipanteChat participante = participanteChatRepo.findBySalaChat_IdSalaAndUsuario_IdUsuario(idSala, idUsuario)
                .orElseThrow(() -> new RuntimeException("Participante no encontrado en esta sala"));

        LocalDateTime ultimaVista = participante.getUltimaVista();

        return mensajeRepo.countBySalaChat_IdSalaAndFechaEnvioAfterAndUsuario_IdUsuarioNot(
                idSala,
                ultimaVista != null ? ultimaVista : LocalDateTime.MIN,
                idUsuario
        );
    }


}
