package com.SportMingle.servicios_SportMingle.Security;

import com.SportMingle.servicios_SportMingle.Model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("JwtUtil — generación y validación de tokens")
class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // Inyectamos la clave como lo haría Spring con @Value
        ReflectionTestUtils.setField(jwtUtil, "secretKey",
                "clave-secreta-muy-larga-que-no-contenga-caracteres-raros");
    }

    private Usuario usuarioEjemplo() {
        Usuario u = new Usuario();
        u.setIdUsuario(1L);
        u.setEmail("juan@sportmingle.com");
        u.setNombre("Juan");
        return u;
    }

    @Test
    @DisplayName("generarToken() debe producir un token no vacío")
    void generarToken_debeRetornarTokenNoVacio() {
        String token = jwtUtil.generarToken(usuarioEjemplo());
        assertThat(token).isNotBlank();
    }

    @Test
    @DisplayName("extraerEmail() debe devolver el email del usuario del token")
    void extraerEmail_debeRetornarEmailCorrecto() {
        Usuario usuario = usuarioEjemplo();
        String token = jwtUtil.generarToken(usuario);

        String emailExtraido = jwtUtil.extraerEmail(token);

        assertThat(emailExtraido).isEqualTo(usuario.getEmail());
    }

    @Test
    @DisplayName("validarToken() debe retornar true para un token válido")
    void validarToken_debeRetornarTrueParaTokenValido() {
        String token = jwtUtil.generarToken(usuarioEjemplo());
        assertThat(jwtUtil.validarToken(token)).isTrue();
    }

    @Test
    @DisplayName("validarToken() debe retornar false para un token manipulado")
    void validarToken_debeRetornarFalseParaTokenManipulado() {
        String tokenManipulado = "eyJhbGciOiJIUzI1NiJ9.tokenFalso.firmaInvalida";
        assertThat(jwtUtil.validarToken(tokenManipulado)).isFalse();
    }

    @Test
    @DisplayName("validarToken() debe retornar false para un string vacío")
    void validarToken_debeRetornarFalseParaStringVacio() {
        assertThat(jwtUtil.validarToken("")).isFalse();
    }

    @Test
    @DisplayName("Dos tokens generados para el mismo usuario deben tener el mismo subject")
    void dosTokens_mismousuario_mismosEmail() {
        Usuario usuario = usuarioEjemplo();
        String token1 = jwtUtil.generarToken(usuario);
        String token2 = jwtUtil.generarToken(usuario);

        assertThat(jwtUtil.extraerEmail(token1)).isEqualTo(jwtUtil.extraerEmail(token2));
    }
}
