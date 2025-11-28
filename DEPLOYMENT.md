# Lokay Share Frontend - Deployment Guide

## 🚀 Despliegue en Render

### Prerequisitos
- Cuenta en [Render](https://render.com)
- API backend desplegada en Render (URL: `https://lokay-share-api.onrender.com`)

### Pasos para desplegar

#### 1. Configurar el proyecto en Render

1. Ve a tu dashboard de Render y selecciona **New +** → **Web Service**
2. Conecta tu repositorio de GitHub/GitLab
3. Configura el servicio:
   - **Name**: `lokay-share-frontend`
   - **Environment**: `Docker`
   - **Region**: Selecciona la más cercana (ej: Oregon)
   - **Branch**: `main` (o tu rama principal)
   - **Dockerfile Path**: `./Dockerfile` (por defecto)

#### 2. Variables de entorno

Agrega esta variable de entorno en Render:

```
NEXT_PUBLIC_API_BASE_URL=https://lokay-share-api.onrender.com
```

#### 3. Configuración avanzada (opcional pero recomendada)

- **Health Check Path**: `/`
- **Auto-Deploy**: Activado (para despliegues automáticos)

#### 4. Deploy

Haz clic en **Create Web Service** y espera a que se complete el build (puede tomar 5-10 minutos la primera vez).

---

## 🐳 Despliegue local con Docker

### Usando Docker Compose (recomendado)

```bash
# Construir y ejecutar
docker-compose up --build

# En segundo plano
docker-compose up -d --build

# Detener
docker-compose down
```

La aplicación estará disponible en `http://localhost:3000`

### Usando Docker directamente

```bash
# Construir la imagen
docker build -t lokay-share-frontend .

# Ejecutar el contenedor
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://lokay-share-api.onrender.com \
  lokay-share-frontend
```

---

## ⚙️ Variables de entorno

Crea un archivo `.env.local` para desarrollo local:

```env
NEXT_PUBLIC_API_BASE_URL=https://lokay-share-api.onrender.com
```

**Nota**: La API en Render (plan gratuito) puede tardar ~30 segundos en "despertar" si está inactiva. La aplicación manejará esto automáticamente con reintentos.

---

## 🔧 Solución de problemas

### La API no responde
- La API en Render (plan gratuito) se suspende después de 15 minutos de inactividad
- Espera ~30 segundos en la primera carga para que la API se active
- Verifica que la URL del backend sea correcta

### Error de build en Render
- Asegúrate de que `output: "standalone"` esté en `next.config.ts`
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Render

### Imágenes no cargan
- Verifica que `remotePatterns` esté configurado en `next.config.ts`
- Asegúrate de que las URLs de imágenes sean accesibles públicamente

---

## 📝 Notas importantes

1. **Plan gratuito de Render**: 
   - El servicio se suspende después de 15 min de inactividad
   - 750 horas/mes de tiempo de ejecución gratuito
   - Primera carga puede ser lenta (~30s)

2. **Optimizaciones para producción**:
   - El Dockerfile usa multi-stage build para reducir tamaño
   - `output: standalone` genera un bundle optimizado
   - Healthcheck configurado para monitoring

3. **CORS**: Si hay problemas de CORS, el backend debe permitir el origen de tu frontend en Render

---

## 🎯 Comandos útiles

```bash
# Desarrollo local
pnpm dev

# Build local
pnpm build

# Ejecutar build local
pnpm start

# Linting
pnpm lint

# Docker logs
docker-compose logs -f
```
