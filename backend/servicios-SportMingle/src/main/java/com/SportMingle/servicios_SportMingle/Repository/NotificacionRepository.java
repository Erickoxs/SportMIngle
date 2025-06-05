package com.SportMingle.servicios_SportMingle.Repository;
import com.SportMingle.servicios_SportMingle.Model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    // Podés agregar búsquedas por usuario o tipo más adelante
}