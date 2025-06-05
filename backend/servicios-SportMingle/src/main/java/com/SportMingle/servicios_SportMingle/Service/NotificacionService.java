package com.SportMingle.servicios_SportMingle.Service;
import com.SportMingle.servicios_SportMingle.Model.Notificacion;
import com.SportMingle.servicios_SportMingle.Repository.NotificacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificacionService {

    private final NotificacionRepository repository;

    public NotificacionService(NotificacionRepository repository) {
        this.repository = repository;
    }

    public List<Notificacion> obtenerTodas() {
        return repository.findAll();
    }

    public Optional<Notificacion> obtenerPorId(Integer id) {
        return repository.findById(id);
    }

    public Notificacion guardar(Notificacion notificacion) {
        return repository.save(notificacion);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
