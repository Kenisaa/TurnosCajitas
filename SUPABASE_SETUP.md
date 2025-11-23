# 🚀 Configuración de Supabase para Plan de Emergencia

Esta guía te ayudará a configurar Supabase para que tu aplicación funcione con datos compartidos en la nube.

## 📋 Paso 1: Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita (puedes usar tu cuenta de GitHub)
3. Haz clic en "New Project"
4. Completa los datos:
   - **Name**: plan-emergencia (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Selecciona la más cercana a ti
   - **Pricing Plan**: Free (gratuito)
5. Espera 1-2 minutos mientras se crea el proyecto

## 📊 Paso 2: Crear las tablas en la base de datos

1. En tu proyecto de Supabase, ve al menú lateral izquierdo
2. Haz clic en **"SQL Editor"**
3. Haz clic en el botón **"+ New Query"**
4. Copia y pega TODO el contenido del archivo `supabase-schema.sql` que está en la raíz del proyecto
5. Haz clic en el botón **"Run"** (o presiona Ctrl/Cmd + Enter)
6. Deberías ver el mensaje "Success. No rows returned"

Esto creará 3 tablas:
- `shifts_data` - Para guardar los nombres de las salidas
- `exit_positions` - Para guardar las posiciones de los puntos en las imágenes
- `emergency_images` - Para guardar las imágenes

## 🔑 Paso 3: Obtener las credenciales

1. En el menú lateral, haz clic en **"Project Settings"** (ícono de engranaje ⚙️)
2. Haz clic en **"API"** en el submenú
3. Busca estas dos cosas:

### Project URL
```
https://xxxxxxxxxxxx.supabase.co
```

### anon public key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS... (muy larga)
```

## 🔧 Paso 4: Configurar las variables de entorno

1. Abre el archivo `.env.local` en la raíz de tu proyecto
2. Reemplaza los valores con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Guarda el archivo

## ✅ Paso 5: Verificar que funciona

1. Detén el servidor de desarrollo si está corriendo (Ctrl + C)
2. Inicia el servidor de nuevo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:3000`
4. Ve al panel de admin (`http://localhost:3000/admin`)
5. Configura un turno con nombres y sube una imagen
6. Abre la misma URL en otro navegador o dispositivo (en la misma red)
7. ¡Deberías ver los mismos datos!

## 🌐 Paso 6: Desplegar a Vercel

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Desde tu proyecto, ejecuta:
```bash
vercel
```

3. Sigue las instrucciones en pantalla

4. **IMPORTANTE**: Configura las variables de entorno en Vercel:
   - Ve a tu proyecto en [vercel.com](https://vercel.com)
   - Settings → Environment Variables
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL` con tu URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` con tu clave
   - Redeploy el proyecto

## 🎉 ¡Listo!

Ahora tu aplicación:
- ✅ Guarda datos en la nube
- ✅ Se comparte entre todos los dispositivos
- ✅ Las imágenes se guardan en base64 en la base de datos
- ✅ Funciona desde cualquier lugar con internet

## 🆘 Problemas comunes

### Error: "Invalid API key"
- Verifica que copiaste bien las credenciales
- Asegúrate de no tener espacios extra
- Reinicia el servidor de desarrollo

### No se guardan los datos
- Verifica que ejecutaste el SQL del schema
- Revisa la consola del navegador (F12) para ver errores
- Ve a Supabase → Table Editor y verifica que existan las tablas

### Las imágenes son muy grandes
- Considera usar Supabase Storage en lugar de base64 (para producción a largo plazo)
- Por ahora, el límite es de ~1MB por imagen aproximadamente

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Tutorial de Next.js + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
