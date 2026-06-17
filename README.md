# SportMingle 🏀⚽🏸

SportMingle es una plataforma full-stack diseñada para solucionar la falta de conectividad en las comunidades deportivas locales. La aplicación permite a deportistas independientes organizar partidos casuales, descubrir clubes deportivos y enterarse de torneos cercanos, centralizando la gestión de múltiples disciplinas en un solo lugar.

---

## 🎯 Características Principales

*   **Partidos Libres y Casuales (Cualquier Usuario):** No necesitas pertenecer a un club. Cualquier jugador puede crear un encuentro, definir el deporte, la hora y el lugar para que otros deportistas de la comunidad se unan libremente.
*   **Plataforma Multideporte:** Diseñada para adaptarse a diferentes disciplinas (baloncesto, fútbol, etc.), permitiendo filtrar las búsquedas según el deporte de interés del usuario.
*   **Geolocalización Inteligente (Radio de 20 KM):** El núcleo de la aplicación filtra dinámicamente partidos libres, clubes y torneos basándose en la ubicación en tiempo real del usuario, limitando el contenido a un rango de 20 km a la redonda para garantizar la relevancia local.
*   **Descubrimiento y Visibilidad de Clubes:** Espacio dedicado para que los clubes deportivos locales (que suelen carecer de plataformas de difusión) puedan darse a conocer y publicar sus actividades y torneos.
*   **Gestión de Miembros para Clubes (QR & Panel):** 
    *   Los administradores de los clubes pueden añadir deportistas escaneando un código QR único.
    *   Módulo de administración privado para que los dueños de los clubes gestionen, acepten o rechacen solicitudes de ingreso.
*   **Mensajería en Tiempo Real:** Chat integrado en los encuentros para coordinar los detalles de los partidos directamente dentro de la plataforma.

---

## 🛠️ Stack Tecnológico

### Backend
*   **Java & Spring Boot:** Framework principal para la construcción de la API REST robusta y escalable.
*   **Spring Security & OAuth2:** Implementación de autenticación segura y control de accesos para usuarios y administradores de clubes.
*   **PostgreSQL (vía Supabase):** Base de datos relacional en producción para garantizar la persistencia e integridad de los datos.

### Frontend
*   **React:** Biblioteca principal para una interfaz de usuario dinámica, fluida y reactiva.

---

## 🚀 Estado del Proyecto & Próximos Pasos (Roadmap)

El proyecto cuenta actualmente con su arquitectura core completamente funcional (Backend, Frontend y Base de Datos en la nube).

*   [x] Configuración de arquitectura Base de Datos en producción (Supabase).
*   [x] Sistema de autenticación seguro.
*   [x] Módulo de geolocalización, emparejamiento multideporte y chat en tiempo real.
*   [ ] **En desarrollo:** Optimización y despliegue final del módulo de Torneos y Competencias locales.
*   [ ] Refactorización de endpoints y desacoplamiento de capas mediante la implementación extensiva de DTOs (Data Transfer Objects).

---

## 📄 Licencia

Este proyecto se encuentra bajo la condición de **Todos los derechos reservados**. Queda prohibida la reproducción, copia o distribución del código fuente sin la autorización explícita del autor.
