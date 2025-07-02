package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.ParticipanteChat;
import com.SportMingle.servicios_SportMingle.Model.SalaChat;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.ParticipanteChatRepository;
import com.SportMingle.servicios_SportMingle.Repository.SalaChatRepository;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ParticipanteChatService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SalaChatRepository salaChatRepository;

    @Autowired
    private ParticipanteChatRepository participanteChatRepository;



    @Autowired
    public ParticipanteChatService(ParticipanteChatRepository participanteChatRepository) {
        this.participanteChatRepository = participanteChatRepository;
    }

    public List<ParticipanteChat> obtenerPorSala(Long idSala) {
        return participanteChatRepository.findBySalaChatIdSala(idSala);
    }

    public List<ParticipanteChat> obtenerPorUsuario(Long idUsuario) {
        return participanteChatRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public ParticipanteChat agregarParticipante(ParticipanteChat participante) {
        Long idUsuario = participante.getUsuario().getIdUsuario();
        Long idSala = participante.getSalaChat().getIdSala();

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        SalaChat sala = salaChatRepository.findById(idSala)
                .orElseThrow(() -> new RuntimeException("Sala no encontrada"));

        // ahora sí seteamos entidades gestionadas
        participante.setUsuario(usuario);
        participante.setSalaChat(sala);

        return participanteChatRepository.save(participante);
    }

    public void eliminarParticipante(Long idParticipante) {
        participanteChatRepository.deleteById(idParticipante);
    }

    public Optional<ParticipanteChat> obtenerPorId(Long idParticipante) {
        return participanteChatRepository.findById(idParticipante);
    }

    public ParticipanteChat actualizarParticipante(ParticipanteChat participante) {
        return participanteChatRepository.save(participante);
    }
}
