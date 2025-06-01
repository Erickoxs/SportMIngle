package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.Deporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeporteRepository extends JpaRepository<Deporte, Long> {

    Optional<Deporte> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
