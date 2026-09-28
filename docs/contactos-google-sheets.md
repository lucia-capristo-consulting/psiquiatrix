# Registrar contactos de los formularios en Google Sheets

Guía para volcar los envíos de **Netlify Forms** (`contacto-pacientes`,
`contacto-psicologos` y `contacto-sumate`) a **una sola planilla** de Google,
sin backend propio.

## Por qué esta vía

- **Gratis e ilimitado**: no depende de Zapier/Make (plan gratis con tope de
  100 tareas/mes) ni de una cuenta de terceros.
- **Instantáneo**: Netlify ejecuta la función apenas se envía el formulario.
- **Casi todo es configuración**: una función de 60 líneas en el repo
  (`netlify/functions/submission-created.js`) y el Apps Script en Google.

## Por qué una función y no un webhook

Hasta el 28/09/2026 esto andaba con los *outgoing webhooks* de Netlify, y se
rompía cada tanto: Netlify **deshabilitaba la notificación sola** y los envíos
dejaban de llegar a la planilla.

La causa, medida: Apps Script no contesta un POST con un "OK", sino con un
**302** que redirige a otra dirección, donde queda el resultado. El webhook lo
contaba como fallo y **reintentaba cada envío cuatro veces** (se ve en
Apps Script → Ejecuciones: cinco `doPost` por envío, cada vez más espaciados).
El script descartaba los repetidos por `id`, así que en la planilla no se
notaba nada; pero Netlify iba sumando fallos hasta deshabilitar la
notificación. Seguir la redirección tampoco sirve: repetida como POST da 411,
y como GET tardó 26 s y dio 404.

La función toma el 302 como éxito, porque llega **después** de que `doPost`
terminó, y no sigue la redirección. Como no es un webhook, Netlify no tiene
nada que deshabilitar.

> Contexto: se evaluó migrar a Vercel/Next.js para usar Server Actions, pero se
> descartó. Server Actions son de Next.js (este proyecto es Vite + React SPA), y
> Vercel **no** tiene manejo de formularios propio — es Netlify el que lo trae de
> fábrica. Para "contactos → base/CRM" alcanza con esto, sin migrar.

## Cómo funciona

Con cada envío verificado, Netlify ejecuta sola la función
`netlify/functions/submission-created.js` (el nombre del archivo es lo que la
engancha al evento). La función hace un `POST` con el envío en JSON a la URL
guardada en la variable de entorno `APPS_SCRIPT_URL`. Esa URL es un Google Apps
Script publicado como web app que agrega una fila al Sheet, en **una pestaña por formulario**
(`contacto-pacientes`, `contacto-psicologos`, `contacto-sumate`), usando los
nombres de campo como encabezados. **Los tres van a la misma planilla**: lo que
los separa es la pestaña, no el archivo. El mismo script le manda después el mail de confirmación a quien
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

4. **Netlify → sitio → Site configuration → Environment variables → Add a
   variable**:
   - *Key:* `APPS_SCRIPT_URL`
   - *Value:* la URL `/exec` del paso 3
   - Tiene que estar **antes** del deploy: la función la lee al ejecutarse, y
     un cambio de variable recién se aplica en el deploy siguiente.

5. **No crear webhooks** en Forms → Form notifications. Si hay alguno viejo
   apuntando al Apps Script, borrarlo: con la función andando, cada envío
   llegaría dos veces.

6. **Probá**: enviá una consulta de prueba en cada formulario del sitio
   publicado y verificá que aparezcan las filas en el Sheet. En Apps Script →
   **Ejecuciones** tiene que aparecer **un solo** `doPost` por envío; si hay
   varios, es que quedó un webhook activo. Si no aparece ninguno, mirar el
   registro de la función en Netlify → Logs → Functions →
   `submission-created`: ahí queda escrito qué pasó.

**Si se redespliega el Apps Script como implementación nueva, la URL cambia**
y hay que actualizar `APPS_SCRIPT_URL` y volver a desplegar el sitio. Publicar
una versión nueva sobre la implementación existente mantiene la URL.

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
- **contacto-psicologos**: `nombre`, `profesion`, `enfoque`, `telefono`, `mail`,
  `conocimiento`, `intencion`, `mensaje`
- **contacto-sumate**: `nombre`, `instancia`, `mail`, `telefono`, `cv`,
  `mensaje`. El `cv` es un adjunto: Netlify lo manda como objeto y en la celda
  termina quedando el link del Drive, no el archivo (ver
  [auto-reply-formularios.md](auto-reply-formularios.md)).

Si se agrega un campo en `index.html` y en el form React, el script le abre una
columna nueva al final la primera vez que llega un envío con ese dato (los
envíos viejos quedan con esa celda vacía).

**Cuidado al renombrar un campo**: para el script es un campo distinto, así que
abre otra columna y la vieja queda ahí con los datos históricos.

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
