# Guía de Despliegue en Producción

Este documento detalla los pasos y configuraciones necesarias para desplegar el servidor backend de PulsePro en un entorno de producción.

## 1. Variables de Entorno

**CRÍTICO:** Nunca subas tu archivo `.env` al repositorio o control de versiones. Configura estas variables directamente en tu panel de hosting o crea un archivo `.env` en el servidor privado.

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `PORT` | El puerto donde escuchará el servidor. En hosts como Render/Heroku/Railway, esto se asigna automáticamente. | `3000` o asignado por host |
| `BASE_URL` | La URL pública de tu sitio. **Debe incluir `https://`**. | `https://api.tu-dominio.com` |
| `MERCADOPAGO_ACCESS_TOKEN` | Tu token de producción de MercadoPago. | `APP_USR-...` |

## 2. Configuración en Servidor

1.  **Clonar/Subir código**: Sube los archivos a tu servidor (excepto `node_modules`).
2.  **Instalar dependencias**:
    ```bash
    npm install --production
    ```
3.  **Configurar Variables**:
    - Crea un archivo `.env` basado en `.env.example` con tus datos reales.
    - O define las variables en el panel de control de tu proveedor de hosting (AWS, DigitalOcean, Heroku, etc.).

## 3. Ejecución con PM2 (Recomendado)

Para mantener el servidor corriendo permanentemente en un VPS (Ubuntu/Linux), usa PM2:

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicación
pm2 start server.js --name "pulsepro-backend"

# Configurar reinicio automático
pm2 startup
pm2 save
```

## 4. HTTPS (SSL)

Para producción, **es obligatorio usar HTTPS**.
- Si usas un servicio PaaS (Heroku, Render), el HTTPS suele ser automático.
- Si usas un VPS (DigitalOcean, AWS), configura **Nginx** como proxy inverso y usa **Certbot** para obtener certificados SSL gratuitos.

---

### Verificación

Una vez desplegado, visita tu URL raíz (ej. `https://api.tu-dominio.com/`). Deberías ver tu `index.html`.
Intenta crear una preferencia de pago verificando que la redirección te lleve de vuelta a tu dominio, no a localhost.

## 5. Despliegue con Portainer (Stacks)

Si utilizas Portainer para gestionar tus contenedores, sigue estos pasos:

### 1. Preparación
Asegúrate de que este código (incluyendo el `Dockerfile` y `docker-compose.yml` que acabamos de crear) esté subido a un repositorio Git (GitHub/GitLab/Bitbucket).

### 2. Crear Stack
1.  Entra a tu Portainer > **Stacks** > **Add stack**.
2.  Selecciona **Repository**.
3.  **Name**: `pulsepro` (o el nombre que prefieras).
4.  **Repository URL**: La URL de tu repositorio Git (ej. `https://github.com/usuario/mi-repo.git`).
5.  **Compose path**: `docker-compose.yml` (déjalo así si el archivo está en la raíz).

### 3. Variables de Entorno (Crucial)
En la sección **Environment variables** del formulario de creación del Stack, añade:

| Name | Value |
| :--- | :--- |
| `PORT` | `3000` (o el que desees) |
| `BASE_URL` | `https://api.tu-sitio.com` |
| `MERCADOPAGO_ACCESS_TOKEN` | `APP_USR-...` |

### 4. Desplegar
Haz clic en **Deploy the stack**. Portainer clonará tu repo, construirá la imagen Docker automáticamente y lanzará el servicio.
