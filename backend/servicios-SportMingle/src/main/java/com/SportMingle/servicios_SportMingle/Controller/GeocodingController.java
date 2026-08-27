package com.SportMingle.servicios_SportMingle.Controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/geocoding")
public class GeocodingController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, Map<String, Object>> cacheGeocoding = new ConcurrentHashMap<>();

    @GetMapping("/reverse")
    public ResponseEntity<?> reverseGeocode(@RequestParam(required = false) Double lat, @RequestParam(required = false) Double lon) {
        if (lat == null || lon == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Se requiere latitud y longitud."));
        }

        // Clave de caché redondeada a 4 decimales (~11 metros de precisión)
        String cacheKey = String.format(java.util.Locale.US, "%.4f,%.4f", lat, lon);

        if (cacheGeocoding.containsKey(cacheKey)) {
            return ResponseEntity.ok(cacheGeocoding.get(cacheKey));
        }

        try {
            String url = String.format(java.util.Locale.US, "https://nominatim.openstreetmap.org/reverse?lat=%f&lon=%f&format=json&addressdetails=1", lat, lon);

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "SportMingle/1.0 (support@sportmingle.com)");
            headers.set("Accept-Language", "es");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> body = response.getBody();
                cacheGeocoding.put(cacheKey, body);
                return ResponseEntity.ok(body);
            }
        } catch (Exception e) {
            // Si Nominatim falla o limita las peticiones, se usa BigDataCloud como respaldo automático
            try {
                String fallbackUrl = String.format(java.util.Locale.US, "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=%f&longitude=%f&localityLanguage=es", lat, lon);
                @SuppressWarnings("unchecked")
                ResponseEntity<Map> fallbackResponse = restTemplate.getForEntity(fallbackUrl, Map.class);
                if (fallbackResponse.getStatusCode().is2xxSuccessful() && fallbackResponse.getBody() != null) {
                    return ResponseEntity.ok(fallbackResponse.getBody());
                }
            } catch (Exception fallbackEx) {
                // Si falla el respaldo, continuar con respuesta por defecto
            }
        }

        return ResponseEntity.ok(Map.of("display_name", "Dirección no disponible"));
    }
}
