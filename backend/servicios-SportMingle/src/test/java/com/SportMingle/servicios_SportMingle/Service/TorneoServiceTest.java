package com.SportMingle.servicios_SportMingle.Service;

import com.SportMingle.servicios_SportMingle.Model.Deporte;
import com.SportMingle.servicios_SportMingle.Model.Torneo;
import com.SportMingle.servicios_SportMingle.Model.Usuario;
import com.SportMingle.servicios_SportMingle.Repository.TorneoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.GeometryFactory;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TorneoService — lógica de torneos")
class TorneoServiceTest {

    @Mock
    private TorneoRepository torneoRepository;

    @Mock
    private UsuarioServiceImpl usuarioService;

    @Mock
    private DeporteService deporteService;

    @InjectMocks
    private TorneoService service;

    @BeforeEach
    void setUp() {
        // TorneoService mezcla inyección por constructor y por campo (@Autowired).
        // Mockito maneja el constructor pero no garantiza los campos @Autowired,
        // así que los inyectamos explícitamente.
        ReflectionTestUtils.setField(service, "geometryFactory", new GeometryFactory());
        ReflectionTestUtils.setField(service, "usuarioService", usuarioService);
        ReflectionTestUtils.setField(service, "deporteService", deporteService);
    }

    // ─── obtenerTodos ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("obtenerTodos() — delega al repositorio y retorna la lista completa")
    void obtenerTodos_retornaListaDelRepositorio() {
        List<Torneo> esperados = List.of(torneoFake(1L, "Copa Bogotá"), torneoFake(2L, "Liga Norte"));
        when(torneoRepository.findAll()).thenReturn(esperados);

        List<Torneo> resultado = service.obtenerTodos();

        assertThat(resultado).hasSize(2).containsExactlyElementsOf(esperados);
        verify(torneoRepository).findAll();
    }

    // ─── obtenerPorId ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("obtenerPorId() — retorna Optional con torneo cuando existe")
    void obtenerPorId_retornaTorneoExistente() {
        Torneo torneo = torneoFake(5L, "Copa Sur");
        when(torneoRepository.findById(5L)).thenReturn(Optional.of(torneo));

        Optional<Torneo> resultado = service.obtenerPorId(5L);

        assertThat(resultado).isPresent();
        assertThat(resultado.get().getNombre()).isEqualTo("Copa Sur");
    }

    @Test
    @DisplayName("obtenerPorId() — retorna Optional vacío cuando no existe")
    void obtenerPorId_retornaVacioSiNoExiste() {
        when(torneoRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Torneo> resultado = service.obtenerPorId(99L);

        assertThat(resultado).isEmpty();
    }

    // ─── existePorId ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("existePorId() — retorna true cuando el torneo existe")
    void existePorId_retornaTrueSiExiste() {
        when(torneoRepository.existsById(1L)).thenReturn(true);
        assertThat(service.existePorId(1L)).isTrue();
    }

    @Test
    @DisplayName("existePorId() — retorna false cuando el torneo no existe")
    void existePorId_retornaFalseSiNoExiste() {
        when(torneoRepository.existsById(99L)).thenReturn(false);
        assertThat(service.existePorId(99L)).isFalse();
    }

    // ─── obtenerPorEstado ─────────────────────────────────────────────────────

    @Test
    @DisplayName("obtenerPorEstado() — retorna solo los torneos con el estado dado")
    void obtenerPorEstado_filtraPorEstado() {
        List<Torneo> activos = List.of(torneoFake(1L, "Activo 1"));
        when(torneoRepository.findByEstado(Torneo.EstadoTorneo.en_progreso)).thenReturn(activos);

        List<Torneo> resultado = service.obtenerPorEstado(Torneo.EstadoTorneo.en_progreso);

        assertThat(resultado).hasSize(1);
        verify(torneoRepository).findByEstado(Torneo.EstadoTorneo.en_progreso);
    }

    // ─── actualizarTorneo ─────────────────────────────────────────────────────

    @Test
    @DisplayName("actualizarTorneo() — lanza RuntimeException si el torneo no existe")
    void actualizarTorneo_lanzaExcepcionSiNoExiste() {
        when(torneoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.actualizarTorneo(99L, new Torneo()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Torneo no encontrado");
    }

    @Test
    @DisplayName("actualizarTorneo() — guarda y retorna el torneo actualizado")
    void actualizarTorneo_guardaCambios() {
        Torneo existente = torneoFake(1L, "Original");
        Torneo cambios = torneoFake(1L, "Actualizado");
        when(torneoRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(torneoRepository.save(any(Torneo.class))).thenAnswer(inv -> inv.getArgument(0));

        Torneo resultado = service.actualizarTorneo(1L, cambios);

        assertThat(resultado.getNombre()).isEqualTo("Actualizado");
        verify(torneoRepository).save(existente);
    }

    // ─── eliminarTorneo ───────────────────────────────────────────────────────

    @Test
    @DisplayName("eliminarTorneo() — llama a deleteById con el id correcto")
    void eliminarTorneo_llamaAlRepositorio() {
        service.eliminarTorneo(3L);
        verify(torneoRepository).deleteById(3L);
    }

    // ─── crearTorneo ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("crearTorneo() — guarda el torneo con la ubicación geográfica correcta")
    void crearTorneo_guardaTorneoConUbicacion() {
        Usuario organizador = new Usuario();
        organizador.setIdUsuario(1L);
        Deporte deporte = new Deporte();

        when(usuarioService.findById(1L)).thenReturn(organizador);
        when(deporteService.obtenerDeportePorId(1L)).thenReturn(deporte);
        when(torneoRepository.save(any(Torneo.class))).thenAnswer(inv -> inv.getArgument(0));

        Torneo resultado = service.crearTorneo(
                "Copa Test", "Descripcion", 1L, 1L,
                LocalDate.now(), LocalDate.now().plusDays(30),
                4.6097, -74.0817,  // Bogotá
                3, "Premio", BigDecimal.valueOf(50000), 8,
                "inscripciones", "https://imagen.com/foto.jpg"
        );

        assertThat(resultado.getNombre()).isEqualTo("Copa Test");
        assertThat(resultado.getUbicacion()).isNotNull();
        assertThat(resultado.getUbicacion().getSRID()).isEqualTo(4326);
        assertThat(resultado.getEstado()).isEqualTo(Torneo.EstadoTorneo.inscripciones);
        verify(torneoRepository).save(any(Torneo.class));
    }

    // ─── helpers ──────────────────────────────────────────────────────────────

    private Torneo torneoFake(Long id, String nombre) {
        Torneo t = new Torneo();
        t.setId(id);
        t.setNombre(nombre);
        return t;
    }
}
