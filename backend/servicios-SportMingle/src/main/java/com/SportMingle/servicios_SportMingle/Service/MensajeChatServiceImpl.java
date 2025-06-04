package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.MensajeChat;
import com.SportMingle.servicios_SportMingle.Repository.MensajeChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MensajeChatServiceImpl implements MensajeChatService {

    @Autowired
    private MensajeChatRepository mensajeChatRepository;

    @Override
    public MensajeChat guardarMensaje(MensajeChat mensaje) {
        return mensajeChatRepository.save(mensaje);
    }

    @Override
    public List<MensajeChat> obtenerMensajesPorSala(Long salaId) {
        return mensajeChatRepository.findBySalaChat_IdSalaOrderByFechaEnvioAsc(salaId);
    }

    @Override
    public MensajeChat obtenerMensajePorId(Long id) {
        return mensajeChatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado con ID: " + id));
    }

    @Override
    public void marcarComoLeido(Long id) {
        Optional<MensajeChat> optionalMensaje = mensajeChatRepository.findById(id);
        if (optionalMensaje.isPresent()) {
            MensajeChat mensaje = optionalMensaje.get();
            mensaje.setLeido(true);
            mensajeChatRepository.save(mensaje);
        } else {
            throw new RuntimeException("Mensaje no encontrado con ID: " + id);
        }
    }
}