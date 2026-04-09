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
- Google Analytics integration (ID pendiente - infraestructura lista en variable de entorno)

### Fase 2: Integraciones Reales
1. **Roboflow AI** - Diagnóstico de cultivos por imagen (modelo origenes/4)
2. **Planet Labs** - Búsqueda de escenas satelitales PlanetScope (3m/px), thumbnails reales, mapa Leaflet interactivo
3. **Logo corporativo** integrado
4. **Información de contacto**:
   - Email: gerencia@origeneskhachi.org
   - Teléfonos: +57 300 558 2757 / +57 310 321 2780
   - Dirección: Finca La Esperanza, Vda La Rambla, San Antonio del Tequendama

### Fase 3: Correcciones (Abril 2026)
- Fix formulario de contacto: department/culture opcionales
- Integración real Planet API (Data API search + thumbnail proxy)
- Variables hardcodeadas movidas a .env
- Endpoint /api/health + keep-alive background task
- Fix orden load_dotenv en server.py

### Fase 4: Panel Administrativo (Abril 2026)
- **Autenticación JWT** con bcrypt para hash de contraseñas
- **Login** exclusivo para gerencia@origeneskhachi.org
- **Dashboard** con estadísticas (total, pendientes, contactados, cerrados)
- **Tabla de consultas** con búsqueda, filtro por estado, cambio de estado inline
- **Eliminación** de consultas
- **Protección brute force** (5 intentos = 15 min lockout)
- Ruta: `/admin`

### API Endpoints
**Públicos:**
- POST `/api/contact/` - Crear consulta
- GET `/api/contact/` - Listar consultas
- POST `/api/roboflow/analyze` - Análisis IA de imágenes
- GET `/api/planet/search` - Buscar escenas satelitales
- GET `/api/planet/thumbnail/{type}/{id}` - Proxy thumbnails
- GET `/api/health` - Health check

**Autenticación:**
- POST `/api/auth/login` - Login admin
- GET `/api/auth/me` - Info usuario actual
- POST `/api/auth/logout` - Cerrar sesión
- POST `/api/auth/refresh` - Refrescar token

**Admin (protegidos):**
- GET `/api/admin/stats` - Estadísticas dashboard
- GET `/api/admin/contacts` - Lista consultas con filtros
- PATCH `/api/admin/contacts/{id}/status` - Cambiar estado
- DELETE `/api/admin/contacts/{id}` - Eliminar consulta

---

## Pendiente

### P0 - Credenciales del Usuario
- [ ] Gmail App Password para notificaciones email
- [ ] Google Analytics Measurement ID (G-XXXXXXXXXX) - pendiente validación Google Enterprise 48h

### P1 - Mejoras Futuras
- [ ] Email templates profesionales
- [ ] Exportar consultas a CSV desde panel admin
- [ ] Dashboard con gráficos de tendencias

---

**Última actualización**: 9 Abril 2026
