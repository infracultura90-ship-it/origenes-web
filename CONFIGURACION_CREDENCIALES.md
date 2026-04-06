# 🔐 INSTRUCCIONES PARA CONFIGURAR CREDENCIALES

## 📧 Notificaciones por Email (Gmail)

### Paso 1: Obtener Contraseña de Aplicación de Gmail

1. Ve a: https://myaccount.google.com/apppasswords
2. Inicia sesión con tu cuenta: **infracultura90@gmail.com**
3. Si te pide verificación en dos pasos, actívala primero en: https://myaccount.google.com/security
4. Crea una nueva contraseña de aplicación:
   - Selecciona "Correo" como aplicación
   - Selecciona "Otro" como dispositivo y escribe "ORÍGENES Website"
5. Copia la contraseña de **16 caracteres** que te genera (sin espacios)

### Paso 2: Agregar Contraseña al Archivo .env

1. Abre el archivo: `/app/backend/.env`
2. Busca la línea: `GMAIL_APP_PASSWORD=""`
3. Pega la contraseña entre las comillas: `GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"`
4. Guarda el archivo
5. Reinicia el backend: `sudo supervisorctl restart backend`

---

## 📊 Google Analytics

### Paso 1: Obtener ID de Medición

Estás en el paso correcto. Ahora:

1. En https://analytics.google.com/ haz clic en el botón azul **"Web"**
2. Completa el formulario:
   - **URL del sitio web**: https://satellite-farm-watch.preview.emergentagent.com (o tu dominio)
   - **Nombre del flujo**: Sitio Web ORÍGENES
3. Haz clic en "Crear flujo"
4. Copia el **ID de medición** que aparece (formato: **G-XXXXXXXXXX**)

### Paso 2: Agregar ID a los Archivos .env

**Frontend:**
1. Abre el archivo: `/app/frontend/.env`
2. Busca la línea: `REACT_APP_GA_MEASUREMENT_ID=""`
3. Pega tu ID: `REACT_APP_GA_MEASUREMENT_ID="G-XXXXXXXXXX"`
4. Guarda el archivo
5. El frontend se reiniciará automáticamente

**Backend (opcional):**
1. Abre el archivo: `/app/backend/.env`
2. Busca la línea: `GA_MEASUREMENT_ID=""`
3. Pega tu ID: `GA_MEASUREMENT_ID="G-XXXXXXXXXX"`
4. Guarda el archivo

---

## ✅ Verificar que Todo Funciona

### Test de Notificaciones por Email:
1. Ve a tu sitio web
2. Llena el formulario de contacto
3. Envía la solicitud
4. Revisa tu email **infracultura90@gmail.com** (debería llegar una notificación)

### Test de Google Analytics:
1. Ve a https://analytics.google.com/
2. En "Informes en tiempo real" verás visitantes activos cuando navegues tu sitio
3. Cada formulario enviado se registrará como evento de conversión

---

## 📝 Resumen de Archivos a Editar

1. `/app/backend/.env` → Agregar `GMAIL_APP_PASSWORD` y `GA_MEASUREMENT_ID`
2. `/app/frontend/.env` → Agregar `REACT_APP_GA_MEASUREMENT_ID`
3. Reiniciar backend: `sudo supervisorctl restart backend`

---

## 💡 Nota Importante

Mientras no agregues las credenciales:
- ✅ El formulario funcionará perfectamente (se guardarán las consultas en la base de datos)
- ❌ NO se enviarán notificaciones por email
- ❌ Google Analytics no registrará eventos

Una vez agregues las credenciales, todo funcionará automáticamente sin necesidad de modificar código.

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas para obtener las credenciales, avísame en qué paso estás y te ayudo paso a paso.
