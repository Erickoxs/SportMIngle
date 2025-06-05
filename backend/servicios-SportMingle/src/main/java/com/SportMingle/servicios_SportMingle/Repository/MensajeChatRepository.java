package com.SportMingle.servicios_SportMingle.Repository;


import com.SportMingle.servicios_SportMingle.Model.MensajeChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MensajeChatRepository extends JpaRepository<MensajeChat, Long> {
    List<MensajeChat> findBySalaChat_IdSalaOrderByFechaEnvioAsc(Long idSala);

    long countBySalaChat_IdSalaAndFechaEnvioAfterAndUsuario_IdUsuarioNot(Long idSala, LocalDateTime fecha, Long idRemitente);



}
