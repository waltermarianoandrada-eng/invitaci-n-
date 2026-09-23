# 🎈 Plataforma de Invitación y Videos Sorpresa

Este documento contiene toda la información necesaria para utilizar la plataforma (Manual de Usuario) y para entender cómo está construida por dentro (Manual Técnico).

---

## 👤 MANUAL DE USUARIO (Para el Organizador)

Esta plataforma permite crear una invitación web donde los invitados pueden grabarse dejando un mensaje de felicitación. Luego, el organizador (o el cumpleañero) puede ver todos los videos seguidos como si fuera una película.

### 1. Enlaces Importantes

Tienes tres secciones principales en tu página web:

*   **Página Principal (Invitados):** `https://invitaci-n-zeta.vercel.app/`
    *   *Uso:* Es el enlace que le envías a los invitados. Aquí ven la cuenta regresiva y el botón para "Grabar Mensaje".
*   **Panel de Administrador:** `https://invitaci-n-zeta.vercel.app/admin`
    *   *Uso:* Es tu zona privada. Te pedirá una contraseña (por defecto: `1234`). Aquí puedes cambiar el nombre del cumpleañero, la fecha, los textos y los colores de la página.
*   **Pantalla de Sorpresa:** `https://invitaci-n-zeta.vercel.app/sorpresa`
    *   *Uso:* Es la pantalla secreta que reproduce todos los videos grabados de forma continua. Puedes acceder a ella haciendo clic en el botón rojo "Ver Videos Sorpresa" dentro de tu Panel de Administrador.

### 2. ¿Cómo configuro la página?
1. Entra al enlace del Administrador (`/admin`).
2. Ingresa con el usuario `admin` y contraseña `1234`.
3. Modifica los textos (Nombre, Fecha, Título) y elige los colores que más te gusten.
4. Haz clic en **"Guardar y Aplicar Cambios"**. La página principal se actualizará automáticamente.

### 3. Solución a problemas comunes (Cámara)
Si un invitado dice que la página le muestra el error *"No se pudo acceder a la cámara"*:
*   **Solución 1:** Recomiéndale que abra el enlace desde su teléfono celular. Los celulares siempre tienen cámara y piden permiso fácilmente.
*   **Solución 2 (Si está en computadora):** Dile que haga clic en el ícono del **candadito 🔒** que está arriba a la izquierda en la barra de direcciones de su navegador (Chrome/Edge), y que cambie el permiso de "Cámara" a **Permitir**.

---
---

## 💻 MANUAL TÉCNICO (Para Desarrolladores)

Esta sección explica la arquitectura y el funcionamiento interno de la aplicación.

### 1. Stack Tecnológico
*   **Frontend:** React 19, TypeScript, Vite.
*   **Estilos:** Vanilla CSS (con un sistema de variables globales inyectadas dinámicamente).
*   **Backend / Base de Datos:** Supabase (PostgreSQL).
*   **Almacenamiento (Storage):** Supabase Storage Bucket (`videos`).
*   **Hosting:** Vercel (Configurado con `vercel.json` para soportar React Router).

### 2. Estructura de Componentes (`src/components/`)
*   `LandingPage.tsx`: Pantalla de inicio pública. Lee la configuración global desde un Contexto.
*   `AdminPanel.tsx`: Panel protegido por contraseña (hardcodeada en el cliente). Permite actualizar variables de configuración (guardadas en localStorage temporalmente o en memoria).
*   `VideoBooth.tsx`: Interfaz de grabación. Utiliza la API nativa del navegador `MediaRecorder`.
*   `SurprisePlayer.tsx`: Reproductor de videos secuencial. Emula el comportamiento de las "Historias de Instagram".

### 3. Flujo de Grabación (`VideoBooth.tsx`)
1. **Acceso a hardware:** Se solicita permiso mediante `navigator.mediaDevices.getUserMedia({ video: true, audio: true })`.
2. **Grabación:** Se instancia `MediaRecorder` para grabar en formato `video/webm`.
3. **Subida:** Al finalizar, el `Blob` resultante se sube a Supabase Storage al bucket público `videos`.
4. **Registro en BD:** Se obtiene la URL pública del archivo subido y se inserta un registro en la tabla `videos`.

### 4. Flujo de Reproducción (`SurprisePlayer.tsx`)
1. **Consulta:** Al montar el componente, se solicitan todas las URLs de la tabla `videos` ordenadas por fecha de creación (`created_at`).
2. **Reproducción:** Se utiliza una etiqueta `<video>` de HTML5.
3. **Avance automático:** El evento nativo `onEnded` del video actualiza el índice (`currentIndex + 1`), lo que cambia dinámicamente el `src` del reproductor y dispara el `autoPlay` del siguiente video de forma instantánea.

### 5. Configuración de Base de Datos (Supabase)
El proyecto requiere una base de datos con el siguiente esquema (ver `setup.sql`):
*   Tabla: `videos (id UUID, video_url TEXT, created_at TIMESTAMP)`
*   Row Level Security (RLS) configurado para permitir `SELECT` e `INSERT` de forma anónima (pública).
*   Bucket de Storage: `videos` configurado como público y con políticas de escritura abierta.

### 6. Despliegue en Vercel y Variables de Entorno
Debido a que es una Single Page Application (SPA) con `react-router-dom`, el proyecto incluye un archivo `vercel.json` en la raíz para redirigir todo el tráfico al `index.html`. Sin esto, al recargar rutas como `/admin` o `/sorpresa` en producción, Vercel devolvería un error 404.

**Variables de Entorno necesarias en Vercel:**
Para que la subida de videos funcione correctamente, se deben configurar estas dos variables en la pestaña de `Settings > Environment Variables` de Vercel:
*   `VITE_SUPABASE_URL`: La URL base del proyecto de Supabase (por ejemplo, `https://fzqitlmbfumqhsxjpgev.supabase.co`). ¡Cuidado con los typos en el ID del proyecto!
*   `VITE_SUPABASE_ANON_KEY`: La clave pública. Tras la actualización reciente de Supabase, debes usar la **"Publishable key"** que comienza con `sb_publishable_...` (o la clásica clave anon tipo JWT `eyJ...` si la obtienes desde la sección Data API).
