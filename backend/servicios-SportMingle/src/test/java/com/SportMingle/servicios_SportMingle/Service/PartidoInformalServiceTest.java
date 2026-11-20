package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Deporte;
import com.SportMingle.servicios_SportMingle.Model.JugadorPartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.PartidoInformal;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.JugadorPartidoInformalRepository;
import com.SportMingle.servicios_SportMingle.Repository.PartidoInformalRepository;
import com.SportMingle.servicios_SportMingle.dto.MiPartidoResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PartidoInformalService — lógica de partidos y agenda")
class PartidoInformalServiceTest {

    @Mock
    private PartidoInformalRepository partidoInformalRepository;

    @Mock
    private JugadorPartidoInformalRepository jugadorPartidoInformalRepository;

    @Mock
    private UsuarioServiceImpl usuarioService;

    @Mock
    private DeporteService deporteService;

    @InjectMocks
    private PartidoInformalService service;

    private static final Long ID_USUARIO = 1L;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(service, "geometryFactory", geometryFactory);
        ReflectionTestUtils.setField(service, "usuarioService", usuarioService);
        ReflectionTestUtils.setField(service, "deporteService", deporteService);
        ReflectionTestUtils.setField(service, "jugadorPartidoInformalRepository", jugadorPartidoInformalRepository);
    }

    @Test
    @DisplayName("obtenerMisPartidos() — incluye partidos inscritos y partidos organizados sin duplicar")
    void obtenerMisPartidos_combinaInscritosYOrganizados() {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(ID_USUARIO);
        usuario.setNombre("Carlos");

        Usuario organizadorOtro = new Usuario();
        organizadorOtro.setIdUsuario(2L);
        organizadorOtro.setNombre("Pedro");

        Deporte futbol = new Deporte();
        futbol.setNombre("Fútbol");

        // 1. Partido inscrito (futuro)
        PartidoInformal pInscrito = new PartidoInformal();
        pInscrito.setIdPartido(10L);
        pInscrito.setOrganizador(organizadorOtro);
        pInscrito.setDeporte(futbol);
        pInscrito.setFechaHora(LocalDateTime.now().plusDays(2));
        pInscrito.setUbicacion(geometryFactory.createPoint(new Coordinate(-74.0, 4.6)));

        JugadorPartidoInformal inscripcion = new JugadorPartidoInformal();
        inscripcion.setIdInscripcion(100L);
        inscripcion.setJugador(usuario);
        inscripcion.setPartidoInformal(pInscrito);

        // 2. Partido organizado por el usuario (pasado)
        PartidoInformal pOrganizado = new PartidoInformal();
        pOrganizado.setIdPartido(20L);
        pOrganizado.setOrganizador(usuario);
        pOrganizado.setDeporte(futbol);
        pOrganizado.setFechaHora(LocalDateTime.now().minusDays(3));
        pOrganizado.setUbicacion(geometryFactory.createPoint(new Coordinate(-74.0, 4.6)));

        when(jugadorPartidoInformalRepository.findInscripcionesDeUsuario(ID_USUARIO))
                .thenReturn(List.of(inscripcion));
        when(partidoInformalRepository.findOrganizadosPorUsuario(ID_USUARIO))
                .thenReturn(List.of(pOrganizado));

        List<MiPartidoResponse> resultado = service.obtenerMisPartidos(ID_USUARIO);

        assertThat(resultado).hasSize(2);

        // El más reciente en fecha (el futuro) va primero
        MiPartidoResponse primero = resultado.get(0);
        assertThat(primero.getIdPartido()).isEqualTo(10L);
        assertThat(primero.isSoyOrganizador()).isFalse();
        assertThat(primero.isEsPasado()).isFalse();
        assertThat(primero.getIdInscripcion()).isEqualTo(100L);

        // El segundo es el organizado (pasado)
        MiPartidoResponse segundo = resultado.get(1);
        assertThat(segundo.getIdPartido()).isEqualTo(20L);
        assertThat(segundo.isSoyOrganizador()).isTrue();
        assertThat(segundo.isEsPasado()).isTrue();
        assertThat(segundo.getIdInscripcion()).isNull();
    }

    @Test
    @DisplayName("getAllPartidos() — solo consulta partidos con fecha posterior a la actual")
    void getAllPartidos_consultaPartidosFuturos() {
        when(partidoInformalRepository.findByFechaHoraGreaterThanEqualOrderByFechaHoraAsc(any(LocalDateTime.class)))
                .thenReturn(List.of());

        List<PartidoInformal> resultado = service.getAllPartidos();

        assertThat(resultado).isEmpty();
        verify(partidoInformalRepository)
                .findByFechaHoraGreaterThanEqualOrderByFechaHoraAsc(any(LocalDateTime.class));
    }

    @Test
    @DisplayName("buscarPorDeporte() — filtra por deporte y solo incluye fechas futuras")
    void buscarPorDeporte_consultaFuturosPorDeporte() {
        when(partidoInformalRepository.findByDeporteIdAndFechaHoraGreaterThanEqualOrderByFechaHoraAsc(eq(1L), any(LocalDateTime.class)))
                .thenReturn(List.of());

        List<PartidoInformal> resultado = service.buscarPorDeporte(1L);

        assertThat(resultado).isEmpty();
        verify(partidoInformalRepository)
                .findByDeporteIdAndFechaHoraGreaterThanEqualOrderByFechaHoraAsc(eq(1L), any(LocalDateTime.class));
    }
}
