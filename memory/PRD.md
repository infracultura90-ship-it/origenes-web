# PRD: ORÍGENES - Nutrición y Precisión
**Landing Page de Consultoría Agrícola de Precisión**

---

## Problema Original
Crear una página web para ORÍGENES: NUTRICIÓN Y PRECISIÓN, empresa de consultoría avanzada para agricultura de transición y precisión en Colombia. Colores: verde agrícola, naranja/marrón, blanco.

---

## Implementado

### Fase 1: Frontend + Backend MongoDB
- 13 secciones: Hero, Services, Technologies, Experience, Cultures, Biofactory, Roboflow Analyzer, Planet Monitoring, Diagnostic Form, Contact, Footer, etc.
- Backend FastAPI + MongoDB con endpoints de contacto
- Email notifications con Gmail SMTP (credenciales pendientes)
- Google Analytics integration (ID pendiente)

### Fase 2: Integraciones Reales
1. **Roboflow AI** - Diagnóstico de cultivos por imagen (API Key: NDLLuR8nj4xCRXJKjvCL, Modelo: origenes/4)
2. **Planet Labs** - Búsqueda de escenas satelitales PlanetScope (3m/px), thumbnails reales, mapa Leaflet interactivo
3. **Logo corporativo** integrado
4. **Información de contacto**:
   - Email: gerencia@origeneskhachi.org
   - Teléfono: +57 300 558 2757 / +57 310 321 2780
   - Dirección: Finca La Esperanza, Vda La Rambla, San Antonio del Tequendama

### Fase 3: Correcciones (Abril 2026)
- Fix formulario de contacto: department/culture ahora opcionales, sin error 422
- Integración real Planet API (antes era mock): Data API search + thumbnail proxy
- Variables hardcodeadas movidas a .env (Roboflow, Planet)
- Endpoint /api/health + keep-alive background task
- Orden de load_dotenv corregido en server.py

### API Endpoints
- POST `/api/contact/` - Crear consulta
- GET `/api/contact/` - Listar consultas
- GET `/api/contact/{id}` - Consulta específica
- PATCH `/api/contact/{id}/status` - Actualizar estado
- POST `/api/roboflow/analyze` - Análisis IA de imágenes
- GET `/api/planet/search?lat=X&lng=X` - Buscar escenas satelitales
- GET `/api/planet/thumbnail/{type}/{id}` - Proxy thumbnails Planet
- GET `/api/planet/health` - Estado conexión Planet
- GET `/api/health` - Health check general

---

## Pendiente

### P0 - Credenciales del Usuario
- [ ] Gmail App Password para notificaciones email
- [ ] Google Analytics Measurement ID (G-XXXXXXXXXX)

### P1 - Mejoras Futuras
- [ ] Panel administrativo para gestionar consultas
- [ ] Email templates profesionales
- [ ] Testing E2E completo con credenciales SMTP/GA

---

**Última actualización**: 9 Abril 2026
