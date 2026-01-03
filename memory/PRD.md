# PRD: ORÍGENES - Nutrición y Precisión
**Landing Page de Consultoría Agrícola de Precisión**

---

## 📋 Problema Original
Crear una página web para ORÍGENES: NUTRICIÓN Y PRECISIÓN, empresa de consultoría avanzada para agricultura de transición y precisión. La empresa utiliza herramientas avanzadas de medición y evaluación de parámetros en tiempo real (SIG, pH, CE, CIC, NPK, temperaturas, índice de clorofila, fotogrametría, estación meteorológica, ORP, grados Brix, análisis de savia). Consultor con más de 17 años de experiencia en 23 departamentos de Colombia.

## 🎯 Requisitos del Usuario
- **Estilo**: Moderno enfocado en "NUTRICIÓN Y PRECISIÓN"
- **Colores**: Verde agricultura, naranja/café, blanco
- **Secciones**: Página completa con todas las secciones principales
- **Objetivo**: La mejor página de consultoría agrícola de Colombia para atraer clientes

## 🏗️ Arquitectura
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB (próxima fase)
- **Deployment**: Emergent Platform

---

## ✅ Implementado (Fecha: 3 Enero 2025)

### Frontend con Mock Data ✓
1. **Header** - Navegación fija con logo y menú responsive
2. **Hero Section** - Hero impactante con imagen de drone, CTAs, estadísticas clave
3. **Services** - 4 servicios principales con iconos y descripciones
4. **Technologies** - 11 tecnologías avanzadas categorizadas + galería de imágenes
5. **Experience** - Sección de experiencia con 17+ años, logros
6. **Magistral Formulation** - Diferenciador clave con imagen y beneficios
7. **Cultures** - Cultivos especializados organizados por tipo
8. **Testimonials** - 3 testimonios de clientes con ratings
9. **FAQ** - Accordion con preguntas frecuentes
10. **Contact Form** - Formulario completo (mock data - localStorage)
11. **Footer** - Footer completo con información de contacto

### Características Técnicas
- Smooth scroll navigation
- Responsive design
- Animaciones sutiles (fade-in, slide-up)
- Toasts con Sonner
- Colores personalizados: verde agricultura (#2d5016, #4a7c2c), naranja (#d97706, #ea580c)
- Componentes Shadcn UI: Button, Input, Textarea, Label, Select, Accordion

---

## 📊 Backlog Priorizado

### P0 - Backend Development (Próxima Fase)
- [ ] Modelo MongoDB para consultas/contactos
- [ ] API endpoint POST `/api/contact` para recibir formularios
- [ ] API endpoint GET `/api/contact` para listar consultas
- [ ] Integración frontend-backend (remover mock.js)
- [ ] Validación de datos en backend
- [ ] Testing completo backend + frontend

### P1 - Mejoras Funcionales
- [ ] Sistema de envío de emails (notificaciones a admin)
- [ ] Panel administrativo para gestionar consultas
- [ ] Galería de casos de éxito con imágenes reales
- [ ] Blog o sección de noticias agrícolas
- [ ] Integración con Google Maps para mostrar cobertura

### P2 - Optimizaciones
- [ ] SEO optimization
- [ ] Google Analytics integration
- [ ] Performance optimization (lazy loading)
- [ ] Accesibilidad (WCAG compliance)
- [ ] Multilingual support (si es necesario)

---

## 🎬 Próximos Pasos
1. Implementar backend con MongoDB
2. Crear API contracts para formulario de contacto
3. Integrar frontend con backend
4. Testing completo con testing_agent_v3
5. Deploy a producción

---

## 📝 API Contracts (Para Backend)

### POST /api/contact
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "department": "string",
  "culture": "string",
  "hectares": "number (optional)",
  "message": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "received",
  "timestamp": "ISO 8601 datetime"
}
```

### GET /api/contact
**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "department": "string",
    "culture": "string",
    "hectares": "number",
    "message": "string",
    "created_at": "ISO 8601 datetime"
  }
]
```

---

**Última actualización**: 3 Enero 2025
