# PRD: ORÍGENES - Nutrición y Precisión
**Landing Page de Consultoría Agrícola de Precisión**

---

## Problema Original
Crear una página web para ORÍGENES: NUTRICIÓN Y PRECISIÓN, empresa de consultoría avanzada para agricultura de transición y precisión en Colombia. Colores: verde agrícola, naranja/marrón, blanco.

---

## Implementado

### Fase 1: Frontend + Backend MongoDB
- 13 secciones: Hero, Services, Technologies, Experience, Cultures, Biofactory, Roboflow Analyzer, Planet Monitoring, Diagnostic Form, Contact, Footer
- Backend FastAPI + MongoDB con endpoints de contacto
- Email notifications con Gmail SMTP (infraestructura lista, credenciales pendientes)
- Google Analytics (infraestructura lista, ID pendiente)

### Fase 2: Integraciones Reales
1. **Roboflow AI** — Diagnóstico de cultivos por imagen (modelo origenes/4)
2. **Planet Labs** — Búsqueda de escenas satelitales PlanetScope (3m/px), thumbnails reales, mapa Leaflet
3. **Logo corporativo** integrado
4. **Contacto**: gerencia@origeneskhachi.org | +57 300 558 2757 / +57 310 321 2780

### Fase 3: Correcciones
- Fix formulario de contacto (department/culture opcionales)
- Integración real Planet API (Data API search + thumbnail proxy)
- Variables hardcodeadas movidas a .env
- Endpoint /api/health + keep-alive background task

### Fase 4: Panel Administrativo
- Autenticación JWT + bcrypt
- Login exclusivo gerencia@origeneskhachi.org
- Dashboard con estadísticas (total, pendientes, contactados, cerrados)
- Tabla de consultas con búsqueda, filtro por estado, cambio de estado inline, eliminación
- Protección brute force (5 intentos = 15 min lockout)
- Ruta: /admin

### Fase 5: WhatsApp + CSV + Email Templates
- **Botón flotante WhatsApp** (+57 300 558 2757) con mensaje estructurado predeterminado
- **Exportación CSV** desde panel admin con filtro por estado
- **Templates de email institucionales**: notificación interna y actualización de estado al cliente
- Email en status change (contacted/closed) notifica al cliente con CTA de WhatsApp

### API Endpoints
**Públicos:**
- POST /api/contact/ | GET /api/contact/
- POST /api/roboflow/analyze
- GET /api/planet/search | GET /api/planet/thumbnail/{type}/{id}
- GET /api/health

**Auth:**
- POST /api/auth/login | GET /api/auth/me | POST /api/auth/logout | POST /api/auth/refresh

**Admin (protegidos):**
- GET /api/admin/stats | GET /api/admin/contacts
- PATCH /api/admin/contacts/{id}/status | DELETE /api/admin/contacts/{id}
- GET /api/admin/contacts/export/csv

---

## Pendiente

### P0
- [ ] Gmail App Password para notificaciones email
- [ ] Google Analytics Measurement ID (G-XXXXXXXXXX)

### P1 - Mejoras Futuras
- [ ] Dashboard con gráficos de tendencias temporales
- [ ] Exportar consultas filtradas por rango de fechas

---

**Última actualización**: 9 Abril 2026
