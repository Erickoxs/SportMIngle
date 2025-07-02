package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.SalaChat;
import com.SportMingle.servicios_SportMingle.Repository.SalaChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SalaChatService {

    private final SalaChatRepository salaChatRepository;
    private final PartidoInformalService partidoService;
    private final TorneoService torneoService;
    private final ClubesService clubService;

    @Autowired
    public SalaChatService(SalaChatRepository salaChatRepository,
                           PartidoInformalService partidoService,
                           TorneoService torneoService,
                           ClubesService clubService) {
        this.salaChatRepository = salaChatRepository;
        this.partidoService = partidoService;
        this.torneoService = torneoService;
        this.clubService = clubService;
    }

    public List<SalaChat> getTodasLasSalas() {
        return salaChatRepository.findAll();
    }

    public Optional<SalaChat> getSalaPorId(Long id) {
        return salaChatRepository.findById(id);
    }

    public List<SalaChat> getSalasPorTipo(SalaChat.TipoSala tipoSala) {
        return salaChatRepository.findByTipoSala(tipoSala);
    }

    public Optional<SalaChat> getSalasPorTipoYReferencia(SalaChat.TipoSala tipoSala, Long idReferencia) {
        return salaChatRepository.findByTipoSalaAndIdReferencia(tipoSala, idReferencia);
    }


    public Optional<SalaChat> buscarPorTipoYReferencia(SalaChat.TipoSala tipoSala, Long idReferencia) {
        return salaChatRepository.findByTipoSalaAndIdReferencia(tipoSala, idReferencia);
    }


    public SalaChat crearSala(SalaChat sala) {
        switch (sala.getTipoSala()) {
            case partido:
                if (!partidoService.existePorId(sala.getIdReferencia())) {
                    throw new IllegalArgumentException("No existe partido con ese idReferencia");
                }
                break;
            case torneo:
                if (!torneoService.existePorId(sala.getIdReferencia())) {
                    throw new IllegalArgumentException("No existe torneo con ese idReferencia");
                }
                break;
            case club:
                if (!clubService.existePorId(sala.getIdReferencia())) {
                    throw new IllegalArgumentException("No existe club con ese idReferencia");
                }
                break;
            // otros casos si aplica
        }
        sala.setFechaCreacion(LocalDateTime.now());
        return salaChatRepository.save(sala);
    }


    public SalaChat actualizarSala(SalaChat sala) {
        return salaChatRepository.save(sala);
    }

    public void eliminarSala(Long id) {
        salaChatRepository.deleteById(id);
    }
}
