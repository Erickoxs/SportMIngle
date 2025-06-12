package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Clubes;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Model.Deporte;
import com.SportMingle.servicios_SportMingle.Repository.ClubesRepository;
import com.SportMingle.servicios_SportMingle.Repository.UsuarioRepository;
import com.SportMingle.servicios_SportMingle.Repository.DeporteRepository;
import com.SportMingle.servicios_SportMingle.dto.CreateClubRequest;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubesService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClubesRepository clubesRepository;

    @Autowired
    private DeporteRepository deporteRepository;

    @Autowired
    private GeometryFactory geometryFactory;

    public Clubes crearClub(CreateClubRequest dto) {
        // Ubicación geográfica
        Point ubicacion = geometryFactory.createPoint(new Coordinate(dto.getLon(), dto.getLat()));
        ubicacion.setSRID(4326);

        // Buscar el deporte
        Deporte deporte = deporteRepository.findById(dto.getIdDeporte())
                .orElseThrow(() -> new RuntimeException("Deporte no encontrado con ID: " + dto.getIdDeporte()));

        // Buscar el administrador
        Usuario administrador = usuarioRepository.findById(dto.getIdAdministrador())
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado con ID: " + dto.getIdAdministrador()));

        // Crear el club
        Clubes club = new Clubes();
        club.setNombre(dto.getNombre());
        club.setDescripcion(dto.getDescripcion());
        club.setLogoUrl(dto.getLogoUrl());
        club.setFechaFundacion(dto.getFechaFundacion());
        club.setDeporte(deporte);
        club.setAdministrador(administrador);
        club.setUbicacion(ubicacion);

        return clubesRepository.save(club);
    }


    public List<Clubes> obtenerClubesCercanos(double lat, double lon, double distancia, String deporte) {
        return clubesRepository.buscarClubesCercanosPorDeporte(lat, lon, distancia, deporte);
    }




    public boolean existePorId(Long id) {
        return clubesRepository.existsById(id);
    }


}
