# Registrar contactos de los formularios en Google Sheets

Guía para volcar los envíos de **Netlify Forms** (`contacto-pacientes` y
`contacto-psicologos`) a una planilla de Google, sin escribir backend y sin
tocar el código del sitio.

## Por qué esta vía

- **Gratis e ilimitado**: no depende de Zapier/Make (plan gratis con tope de
  100 tareas/mes) ni de una cuenta de terceros.
- **Instantáneo**: Netlify pega el webhook apenas se envía el formulario.
- **Cero mantenimiento en el repo**: es todo configuración de Netlify + Google.
  El código de la SPA no se modifica.

> Contexto: se evaluó migrar a Vercel/Next.js para usar Server Actions, pero se
> descartó. Server Actions son de Next.js (este proyecto es Vite + React SPA), y
> Vercel **no** tiene manejo de formularios propio — es Netlify el que lo trae de
> fábrica. Para "contactos → base/CRM" alcanza con este webhook, sin migrar.

## Cómo funciona

Netlify Forms permite *outgoing webhooks*: por cada envío, hace un `POST` con el
payload JSON a una URL. Esa URL es un Google Apps Script publicado como web app
que agrega una fila al Sheet, en **una pestaña por formulario**
(`contacto-pacientes`, `contacto-psicologos`), usando los nombres de campo como
encabezados. El mismo script le manda después el mail de confirmación a quien
escribió (ver [auto-reply-formularios.md](auto-reply-formularios.md)).

Payload relevante de Netlify: `{ form_name, created_at, data: { ...campos } }`.

## Pasos

1. **Creá un Google Sheet** en blanco.

2. **Extensiones → Apps Script**. Borrá el contenido y pegá el de
   [`apps-script/Codigo.gs`](apps-script/Codigo.gs). Guardá.

3. **Implementar (Deploy) → Nueva implementación → Aplicación web**:
   - *Ejecutar como:* **Yo** (tu cuenta)
   - *Quién tiene acceso:* **Cualquier usuario** (para que Netlify pueda pegarle)
   - **Implementar** → autorizá los permisos → **copiá la URL** (termina en `/exec`).

4. **Netlify → sitio → Forms → Settings & usage → Form notifications → Add
   notification → Outgoing webhook**:
   - *Event to listen for:* **New form submission**
   - *URL to notify:* la URL `/exec` del paso 3
   - **Save**. (Un solo webhook recibe ambos formularios; el script los separa
     por pestaña.)

5. **Probá**: enviá una consulta de prueba en cada formulario del sitio
   publicado y verificá que aparezcan las filas en el Sheet.

## Script (Google Apps Script)

El código completo vive en **[`apps-script/Codigo.gs`](apps-script/Codigo.gs)**,
como archivo propio del repo: así queda en el historial, se pueden revisar los
cambios y no depende de que alguien recuerde qué había escrito en Google.

El repo no puede ejecutarlo — es una copia de referencia. **Si se edita el
script dentro de Google, hay que traer el cambio a ese archivo, y al revés.**

Ese mismo script hace dos cosas por cada envío: agrega la fila al Sheet y manda
el mail de confirmación a quien escribió. La parte del mail está explicada en
[auto-reply-formularios.md](auto-reply-formularios.md).

> **Cómo cambiar los títulos de las columnas**: editá el texto **a la derecha**
> en `ETIQUETAS` (ej. `nombre: 'Nombre y apellido'`). NO cambies la clave de la
> izquierda: es el nombre interno del campo del formulario y el script la usa
> para saber qué valor poner en cada columna. Renombrar el encabezado a mano
> **en el Sheet** rompe ese vínculo y la columna quedaría vacía.
>
> **Importante sobre el dedup**: la columna `id` es la que permite descartar
> duplicados. Si venías de una versión anterior del script (encabezados sin
> `id`, o con los nombres crudos de campo), **borrá todas las filas de cada
> pestaña** (incluido el encabezado) antes de probar: así el script reescribe
> los encabezados con los títulos de `ETIQUETAS` y el dedup empieza a funcionar.
> Los duplicados viejos se limpian en ese mismo paso.

## Columnas por formulario

Los campos están definidos en los stubs de `index.html`:

- **contacto-pacientes**: `nombre`, `telefono`, `mail`, `destinatario`,
  `conocimiento`, `mensaje`
- **contacto-psicologos**: `nombre`, `profesion`, `telefono`, `mail`,
  `conocimiento`, `intencion`, `mensaje`

Si se agregan/renombran campos en `index.html` y en el form React, aparecerán
como columnas nuevas automáticamente (los envíos viejos quedan con esas celdas
vacías).

## Notas

- **Email + Sheet a la vez**: se pueden tener las dos notificaciones. El mail
  (Forms → notifications → Email) avisa al instante; el Sheet queda como
  registro consultable.
- **Re-deploy del script**: si editás el código del Apps Script, hay que crear
  una **nueva versión de la implementación** para que tome los cambios (o
  "Administrar implementaciones" → editar → nueva versión). La URL `/exec` se
  mantiene.
- Cuando el volumen lo justifique, este mismo Sheet se puede volcar a un CRM
  real (HubSpot, Pipedrive, etc.) sin rehacer nada del sitio.
