package com.SportMingle.servicios_SportMingle.Service;
import com.SportMingle.servicios_SportMingle.Model.MensajeEliminado;
import com.SportMingle.servicios_SportMingle.Repository.MensajeEliminadoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MensajeEliminadoService {

    private final MensajeEliminadoRepository repository;

    public MensajeEliminadoService(MensajeEliminadoRepository repository) {
        this.repository = repository;
    }

    public List<MensajeEliminado> obtenerTodos() {
        return repository.findAll();
    }

    public Optional<MensajeEliminado> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public MensajeEliminado guardar(MensajeEliminado mensajeEliminado) {
        return repository.save(mensajeEliminado);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
