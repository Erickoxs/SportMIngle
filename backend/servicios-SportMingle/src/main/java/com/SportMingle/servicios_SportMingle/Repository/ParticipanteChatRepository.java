package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.ParticipanteChat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipanteChatRepository extends JpaRepository<ParticipanteChat, Long> {
    List<ParticipanteChat> findBySalaChatIdSala(Long idSala);
    List<ParticipanteChat> findByUsuarioIdUsuario(Long idUsuario);
    Optional<ParticipanteChat> findBySalaChat_IdSalaAndUsuario_IdUsuario(Long idSala, Long idUsuario);
}
