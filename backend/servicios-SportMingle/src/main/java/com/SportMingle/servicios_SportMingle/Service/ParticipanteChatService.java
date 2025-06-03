package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.ParticipanteChat;
import com.SportMingle.servicios_SportMingle.Repository.ParticipanteChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ParticipanteChatService {

    private final ParticipanteChatRepository participanteChatRepository;

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
        participante.setFechaUnion(LocalDateTime.now());
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
