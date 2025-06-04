package com.SportMingle.servicios_SportMingle.Repository;
import com.SportMingle.servicios_SportMingle.Model.MensajeEliminado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensajeEliminadoRepository extends JpaRepository<MensajeEliminado, Long> {
    // Aquí podés agregar métodos custom si los necesitás más adelante
}
