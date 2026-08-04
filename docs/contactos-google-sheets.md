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
encabezados.

Payload relevante de Netlify: `{ form_name, created_at, data: { ...campos } }`.

## Pasos

1. **Creá un Google Sheet** en blanco.

2. **Extensiones → Apps Script**. Borrá el contenido y pegá el script de abajo.
   Guardá.

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

```javascript
// Netlify Forms -> Google Sheets
// Recibe el webhook de Netlify y agrega cada envío como una fila,
// en una pestaña por formulario (contacto-pacientes / contacto-psicologos).
// - Deduplica por el id único de envío que manda Netlify (reintentos /
//   notificación duplicada NO generan filas repetidas).
// - Los TÍTULOS visibles de las columnas se definen en ETIQUETAS: editá el
//   texto de la derecha; NO toques la clave de la izquierda (es el nombre
//   interno del campo del formulario).

var ETIQUETAS = {
  id: 'ID',
  Fecha: 'Fecha',
  nombre: 'Nombre y apellido',
  telefono: 'Teléfono',
  mail: 'Email',
  destinatario: 'Para quién es',     // solo contacto-pacientes
  conocimiento: 'Cómo nos conoció',
  mensaje: 'Mensaje',
  profesion: 'Profesión',            // solo contacto-psicologos
  intencion: 'Intención de derivar', // solo contacto-psicologos
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // serializa llegadas concurrentes para que el dedup funcione
  try {
    var body = JSON.parse(e.postData.contents);
    var formName = body.form_name || 'sin-nombre';
    var data = body.data || {};
    var createdAt = body.created_at || new Date().toISOString();
    var submissionId = body.id || '';

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(formName) || ss.insertSheet(formName);

    // Campos internos a ignorar (honeypot antispam / form-name)
    var skip = { 'bot-field': true, 'form-name': true };
    var fields = Object.keys(data).filter(function (k) { return !skip[k]; });

    // Orden interno de columnas (claves de campo, NO los títulos visibles)
    var keys = ['id', 'Fecha'].concat(fields);

    // Encabezados la primera vez: escribo los títulos lindos de ETIQUETAS
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(keys.map(function (k) { return ETIQUETAS[k] || k; }));
    }

    // Mapa título-visible -> clave-de-campo, para saber qué valor va en cada columna
    var keyByLabel = {};
    Object.keys(ETIQUETAS).forEach(function (k) { keyByLabel[ETIQUETAS[k]] = k; });

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headerKeys = headers.map(function (h) { return keyByLabel[h] || h; });

    // Dedup: si ya existe este id de envío, no agrego otra fila.
    var idCol = headerKeys.indexOf('id');
    if (submissionId && idCol !== -1 && sheet.getLastRow() > 1) {
      var ids = sheet.getRange(2, idCol + 1, sheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(submissionId)) {
          return ContentService.createTextOutput(JSON.stringify({ ok: true, duplicate: true }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // Alineo cada valor a su columna, resolviendo el título a su clave de campo
    var row = headerKeys.map(function (key) {
      if (key === 'id') return submissionId;
      if (key === 'Fecha') return createdAt;
      return data[key] !== undefined ? data[key] : '';
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

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
