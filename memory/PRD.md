# PRD: ORÍGENES - Nutrición y Precisión
**Landing Page de Consultoría Agrícola de Precisión**

---

## 📋 Problema Original
Crear una página web para ORÍGENES: NUTRICIÓN Y PRECISIÓN, empresa de consultoría avanzada para agricultura de transición y precisión.

---

## ✅ Implementado (Actualizado: 3 Enero 2025)

### Fase 1: Frontend Initial + Backend MongoDB ✓
- 11 secciones completas funcionando
- Backend MongoDB con endpoints de contacto
- Email notifications con Gmail SMTP (credenciales pendientes)
- Google Analytics integration (ID pendiente)

### Fase 2: Nuevas Características ✓
1. **Módulo de Monitoreo Planet** - Mapa de vigor con API Key PLAK5ee68deaddf845b39e008238e1b94c54
2. **Portafolio de Biofábricas** - Sección completa con capacidades, proyectos y fórmulas sinérgicas
3. **Botón Solicitar Diagnóstico** - Modal con formulario de coordenadas geográficas
4. **Información de contacto actualizada**:
   - Email: gerencia@origeneskhachi.org  
   - Teléfono: +57 300 558 2757
   - Dirección: Finca La Esperanza, Vda La Rambla, San Antonio del Tequendama

### Backend API Endpoints
- POST `/api/contact/` - Crear consulta (funciona para contacto y diagnóstico)
- GET `/api/contact/` - Listar consultas
- GET `/api/contact/{id}` - Consulta específica
- PATCH `/api/contact/{id}/status` - Actualizar estado

---

## 📊 Próximos Pasos

### P0 - Configuración de Credenciales
- [ ] Agregar Gmail App Password para notificaciones email
- [ ] Agregar Google Analytics Measurement ID
- [ ] Testing completo end-to-end

### P1 - Mejoras
- [ ] Integración real de Planet API para mapas satelitales
- [ ] Panel administrativo para gestionar consultas
- [ ] Email templates profesionales

---

**Última actualización**: 3 Enero 2025
