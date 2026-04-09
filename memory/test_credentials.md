# Test Credentials - ORÍGENES

## Admin Panel
- URL: /admin
- Email: gerencia@origeneskhachi.org
- Password: Origenes2026$Sec
- Role: admin

## Auth Endpoints
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- POST /api/auth/refresh

## Admin Endpoints (require Bearer token)
- GET /api/admin/stats
- GET /api/admin/contacts
- PATCH /api/admin/contacts/{id}/status
- DELETE /api/admin/contacts/{id}
