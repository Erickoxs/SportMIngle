package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.ParticipanteChat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipanteChatRepository extends JpaRepository<ParticipanteChat, Long> {
    List<ParticipanteChat> findBySalaChatIdSala(Long idSala);
    List<ParticipanteChat> findByUsuarioIdUsuario(Long idUsuario);
}
