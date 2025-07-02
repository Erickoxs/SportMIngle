package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.SalaChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaChatRepository extends JpaRepository<SalaChat, Long> {

    List<SalaChat> findByTipoSala(SalaChat.TipoSala tipoSala);

    Optional<SalaChat> findByTipoSalaAndIdReferencia(SalaChat.TipoSala tipoSala, Long idReferencia);



}
