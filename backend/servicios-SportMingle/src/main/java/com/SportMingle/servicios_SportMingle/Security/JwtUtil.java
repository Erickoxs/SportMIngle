package com.SportMingle.servicios_SportMingle.Security;

import com.SportMingle.servicios_SportMingle.Model.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "clave-secreta-muy-larga-que-no-contenga-caracteres-raros";

    private Key getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(Usuario usuario) {
        long expirationTime = 1000 * 60 * 60 * 10; // 10 horas

        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .claim("id", usuario.getIdUsuario()) // <-- Aquí agregas el ID al token
                .claim("nombre", usuario.getNombre()) // <-- Nombre del usuario
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String extraerEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}

