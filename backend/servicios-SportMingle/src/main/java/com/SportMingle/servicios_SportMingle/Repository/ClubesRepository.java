package com.SportMingle.servicios_SportMingle.Repository;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubesRepository extends JpaRepository<Clubes, Long> {
    // List<Clubes> findByDeporte(String deporte);
}
