# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

- `npm run dev` — Vite dev server (HMR)
- `npm run build` — build de producción a `dist/`
- `npm run preview` — sirve `dist/` localmente para verificar el build

No hay tests ni linter configurados.

## Stack

React 18 + Vite 5 + Tailwind 3, SPA con `react-router-dom` v6, animaciones con `framer-motion`, SEO con `react-helmet-async`. Deploy en Netlify (build `npm run build`, publish `dist`).

Idioma: español de Argentina (`lang="es-AR"`). Todo el contenido visible está en español.

## Arquitectura

### Routing y layout

- **Dos páginas, dos audiencias**: `/` (`Pacientes`) y `/psicologos` (`Psicologos`). Wildcard `*` cae a `Pacientes`. Definidas en `src/App.jsx`.
- **`Layout.jsx`** envuelve ambas rutas y monta `Nav`, `Footer`, `FloatingCTA`. Hace `scrollTo(0)` en cada cambio de `pathname`.
- **`Nav.jsx`** detecta la audiencia con `pathname.startsWith('/psicologos')` y conmuta:
  - el set de anclas del menú (`NAV_PACIENTES` vs `NAV_PSICO`)
  - el CTA principal (texto + href)
  - un cross-link "Soy paciente" / "Soy psicólogo/a" que lleva a la otra audiencia
- Las páginas son composiciones de secciones; cada sección de página vive en `src/components/` (genéricas) o `src/components/psico/` (específicas de `/psicologos`).

### Anclas y nav activa

Las secciones se navegan por `id` HTML (no por rutas). El hook `src/hooks/useActiveSection.js` usa `IntersectionObserver` para detectar la sección visible y subrayar el item activo del nav. **Si agregás una sección al menú**, su `id` en el componente debe coincidir exactamente con el `anchor` declarado en `NAV_PACIENTES` / `NAV_PSICO` en `Nav.jsx`.

`scroll-padding-top: 96px` está definido en `src/index.css` para que el sticky header no tape el inicio de las secciones al saltar por ancla.

### SEO

- Cada página debe renderizar `<Seo />` (`src/seo/Seo.jsx`) con `title`, `description`, `path`, y opcionalmente `jsonLd`. Maneja canonical y Open Graph (usado por WhatsApp, Facebook, Instagram, LinkedIn y Telegram para el preview del link). No hay tags de Twitter Cards: la marca no tiene cuenta en Twitter/X y se removieron a propósito — no volver a agregarlas.
- La imagen de preview por defecto es `public/og-psiquiatrix.jpg` (1731×909), declarada en `src/seo/site.js` con el armador `imagenOg()`. Las dimensiones se escriben a mano y **tienen que coincidir con el archivo**: los scrapers les creen sin verificarlas.
- **Cada ruta puede tener su propia imagen de preview**: se le agrega `ogImage: imagenOg({...})` a su entrada en `pages.js` y con eso alcanza. Si no declara ninguna, usa la de la home. En `src/seo/pages.js` hay un bloque comentado con el ejemplo listo para `/psicologos`.

  Lo que hace que esto funcione de verdad es que **`scripts/prerender-meta.mjs` también lee la imagen de la página**. Antes tenía la de la home fija: una ruta con imagen propia igual mostraba la de la home al compartirla por WhatsApp, que es justo donde se nota, porque WhatsApp lee el HTML prerenderizado y no lo que arma React.
- `HelmetProvider` ya está montado en `src/main.jsx` — no envolver de nuevo.
- Schemas JSON-LD viven en `src/seo/schema.js` (`medicalClinicSchema`, `psicologosServiceSchema`). Si agregás una página nueva, exportá su schema desde ese archivo en vez de inlinearlo.
- `SITE_URL`, `SITE_NAME`, los datos de la imagen OG y el logo (`LOGO`) viven en `src/seo/site.js`, y de ahí los toman `Seo.jsx`, `schema.js`, `pages.js` y el script de prerender. Si cambia el dominio, además hay que tocar `public/sitemap.xml` y `public/robots.txt`, que son estáticos.
- **El dominio primario es `www.psiquiatrix.ar`, con `www`.** El apex (`psiquiatrix.ar`) también resuelve, pero redirige con 301 al `www`. Es una decisión de marca: al ser `.ar` una extensión poco común, el `www` deja claro que es un sitio web y no una red social, y se usa así en tarjetas y material impreso. Por eso los canonical y `og:url` deben llevar `www`: tienen que coincidir con la URL final, no con la que redirige.

- Los archivos de marca (logotipo en SVG y PNG, con fondo y sin fondo) viven en `public/marca/`. El texto está convertido a curvas, así que no dependen de tener instalada Instrument Serif — es lo que permite mandárselos a una imprenta. El campo `logo` del JSON-LD apunta a la versión transparente.

#### Códigos QR

Las cuatro piezas de `public/marca/qr-*` las genera **`scripts/generar-qr.cjs`**, que NO corre en el build: se ejecuta a mano cuando cambia el dominio, el logotipo o los textos. Sus dependencias se instalan con `npm install --no-save` y a propósito no están en `package.json`.

Hay dos variantes de cada destino y las diferencias no son estéticas: la de **pantalla** va sobre bone con corrección de errores M; la de **impresión** va sobre blanco puro —el bone impreso sale como un gris sucio— y con corrección Q, que tolera perder un cuarto del código cuando el papel se dobla o se mancha.

La bajada ("PARA PROFESIONALES") se convierte a curvas leyendo el `.woff2` real del sitio, así que el SVG no depende de tener instalada ninguna tipografía. Usa el estilo del pie del sitio: JetBrains Mono, interletrado 0.18em, color taupe.

**El script lee cada pieza después de generarla** y falla si no decodifica el destino esperado. El logotipo y la bajada quedan fuera del código, pero eso hay que comprobarlo, no suponerlo.

#### Listado de /marca/

Netlify no genera listados de carpeta. Para que `www.psiquiatrix.ar/marca/` muestre los archivos sin tener que saber cada nombre, **`scripts/build-marca-index.mjs`** genera `dist/marca/index.html` después del build (encadenado en el script `build`, igual que el prerender).

Lee la carpeta en cada build, así que **para sumar un logo alcanza con dejarlo en `public/marca/`**: aparece solo, con su formato, medidas y peso. Los títulos lindos salen del mapa `LABELS` del script; un archivo que no esté ahí igual se lista, con el nombre prettificado.

La página va con `noindex`: es accesible por link pero no compite en los resultados de búsqueda. Por eso **no** hay que bloquearla en `robots.txt` — si se bloqueara, Google no podría leer el `noindex`.

`public/_redirects` tiene sus dos reglas (`/marca` y `/marca/`) antes del fallback de la SPA; sin ellas, entrar a la carpeta mostraría la home.

#### Prerender de metadatos (scrapers de WhatsApp)

Los scrapers de preview (WhatsApp, Facebook, LinkedIn, Telegram) **no ejecutan JavaScript**: leen el HTML crudo del servidor y se van. Como esto es una SPA, sin prerender todas las rutas devolvían el mismo `index.html` y el preview de `/psicologos` mostraba el título de la home. Google no tiene el problema porque sí ejecuta JS.

La solución tiene tres piezas que **deben mantenerse sincronizadas**:

1. **`src/seo/pages.js`** — fuente única de verdad del SEO por ruta (`path`, `file`, `title`, `description`, `jsonLd`). La consumen tanto los componentes de página (`<Seo {...pageByPath('/...')} />`) como el prerender.
2. **`scripts/prerender-meta.mjs`** — corre después de `vite build` (encadenado en el script `build` de `package.json`). Toma `dist/index.html` como plantilla y reescribe el bloque entre `<!-- seo:start -->` y `<!-- seo:end -->` con los tags de cada ruta, generando un HTML por página.
3. **`public/_redirects`** — una regla `200` por ruta prerenderizada, **antes** del fallback `/*`. Gana la primera regla que matchea.

Es un rewrite, no un redirect: la URL del browser no cambia, así que React Router sigue viendo `/psicologos` y renderiza lo que corresponde.

**No editar a mano los tags de SEO en `index.html`**: están dentro de los marcadores y el build los pisa. Para cambiar un título o una descripción, editar `pages.js`.

Esto **no es SSG**: el `<body>` sigue vacío y lo llena React. Sólo se prerenderiza el `<head>`, que es lo único que los scrapers leen.

Para agregar una página: sumarla a `PAGES` en `pages.js`, agregar su regla en `_redirects` y su `<loc>` en `public/sitemap.xml`.

### Convocatoria (/sumate)

Página para reclutar psiquiatras, con su texto en `src/contenido/sumate.js`.

**Es permanente, no una búsqueda puntual.** Cuando se cubren los puestos no se despublica: se cambia `BUSQUEDA_ABIERTA` a `false` y el cartel del encabezado pasa a decir que no hay búsquedas abiertas. Así sigue recibiendo candidaturas espontáneas en vez de quedar vieja.

Va **fuera del `Layout`**, con una cabecera propia mínima y el `Footer` del sitio: el nav conmuta por audiencia y sus anclas no existen acá. A propósito **no está enlazada desde el menú** — un "trabajá con nosotros" arriba le cambia el tono a un sitio que le habla a pacientes.

**Va con `noindex`** pero **sí se prerenderiza**: son cosas distintas. Se comparte por link con residencias y colegas, así que el preview de WhatsApp tiene que salir bien; lo que no queremos es que compita en los resultados de búsqueda. Para indexarla: borrar `noindex: true` de su entrada en `pages.js` y sumar su `<loc>` al sitemap.

El formulario es `contacto-sumate`, con su stub en `index.html` como los otros dos. **El CV no se sube por el formulario**: es un dato personal y terminaría en el mismo Sheet que las consultas de pacientes, así que se pide por mail.

### Tarjetas digitales

Cada directora tiene una tarjeta de contacto en su propia ruta (`/amanda`). Son **dos pantallas que se complementan**:

- **`/amanda/tarjeta`** — la que ella MUESTRA en el celular: su nombre y un QR grande. Entra sin scrollear y el QR va sobre blanco puro, no sobre el bone de la marca: se escanea desde lejos, con reflejos y con el brillo bajo, y ahí cada punto de contraste cuenta. Va con `noindex`.
- **`/amanda`** — la que LEE quien escaneó. "Guardar contacto" ocupa todo el ancho y va antes que nada: quien llega está parado, con el celular en la mano, y quiere hacer una sola cosa. Va indexada, con datos estructurados `Physician`.

Las dos van **fuera del `Layout`**: no llevan el nav ni el pie del sitio.

Los datos están en `src/contenido/tarjetas.js`. **La bio no se duplica**: sale de `bios-directoras.js`, la misma que usa el resto del sitio.

**`scripts/generar-tarjetas.cjs`** (manual, no corre en el build) produce por persona: la foto del encabezado, el QR, el `.vcf` para agendar y la imagen de preview. El QR lleva la "x" de la marca en el centro, así que va con corrección de errores H y **se lee después de generarlo**: tapar el centro de un código es justo lo que lo puede volver ilegible.

El `.vcf` va en **vCard 3.0** (no 4.0: es la que abren sin chistar iPhone y Android) con saltos CRLF, y `public/_headers` le fija el `Content-Type`; sin eso el iPhone lo baja como archivo en vez de abrir la ficha para agendar.

Para sumar a otra persona: darla de alta en `tarjetas.js`, correr el generador, y agregar su regla en `_redirects` y su `<loc>` en el sitemap. La ruta, el prerender y el schema salen solos.

### Textos y datos editables

Todo lo que se cambia sin tocar el diseño vive en **`src/contenido/`**, con su índice en `src/contenido/LEEME.md`: bios de las directoras, número y mensajes de WhatsApp, textos de confirmación de los formularios y códigos de país. Ningún componente tiene textos escritos adentro.

Dos excepciones que NO pueden estar ahí: los títulos y descripciones de SEO viven en `src/seo/pages.js` (los lee el script de prerender durante el build), y el texto de los mails automáticos vive en una pestaña del Google Sheet, a propósito, para poder cambiarlo sin publicar.

#### Config de contacto (WhatsApp)

`src/contenido/contacto-whatsapp.js` centraliza el número de WhatsApp (`WA_NUMBER`, solo dígitos, formato internacional sin `+` ni espacios) y los mensajes prellenados (`WA_MESSAGES`). Lo consumen `CTA.jsx` y `FloatingCTA.jsx`. Para cambiar el número o los textos de WhatsApp, editar **solo** este archivo.

`src/contenido/mensajes-formulario.js` hace lo mismo con los textos que aparecen **después de enviar** un formulario: confirmación y error, para las dos audiencias. Ningún componente tiene esos textos escritos adentro.

En el de pacientes el mensaje de éxito tiene **dos versiones** (`conMail` / `sinMail`) porque ahí el mail es opcional: a quien no dejó dirección no se le puede prometer un correo. Están escritas enteras las dos, en vez de armarse concatenando partes, para que se vea exactamente lo que va a leer la persona.

**Ese archivo promete un plazo** ("a la brevedad") y el auto-reply promete lo mismo con otras palabras. La persona lee los dos con minutos de diferencia, así que si se cambia el plazo hay que cambiarlo también en la pestaña `plantillas-mail` del Sheet (ver `docs/auto-reply-formularios.md`).

El estilo de los campos vive en `src/lib/formulario.js` (`inputCls`), compartido por los dos formularios. No bajar de 16px: Safari en iPhone hace zoom automático al enfocar un campo con letra más chica.

### Netlify Forms (importante)

Patrón SPA + Netlify Forms con dos partes que **deben mantenerse sincronizadas**:

1. **Stub estático en `index.html`** con `data-netlify="true"` y todos los `name` de los campos. El bot de Netlify lee este HTML al hacer deploy para registrar el formulario y sus campos. Sin el stub, el form no existe en Netlify aunque el React funcione.
2. **Form interactivo en React** que envía vía `submitNetlifyForm(formName, data)` desde `src/lib/netlifyForm.js`. Hace `POST /` con `application/x-www-form-urlencoded` e incluye `form-name` en el payload.

Forms actuales: `contacto-pacientes` y `contacto-psicologos`. Para agregar uno nuevo: stub en `index.html` con todos los campos + usar el helper desde el componente con el mismo `form-name`.

Para registrar los envíos en un Google Sheet (vía outgoing webhook de Netlify, sin backend ni cambios de código), ver `docs/contactos-google-sheets.md`. Ahí también queda documentado por qué se descartó migrar a Vercel/Next.js.

El mismo webhook dispara el **auto-reply**: el mail de confirmación que recibe quien completa un formulario. Ver `docs/auto-reply-formularios.md`. Dos cosas que conviene no romper: el mail **no repite lo que la persona escribió** (puede traer información de salud) y el de pacientes lleva el aviso de urgencias.

**El script de Apps Script tiene su copia de referencia en `docs/apps-script/Codigo.gs`.** No se ejecuta desde el repo — vive dentro del Google Sheet — pero está versionado ahí para poder revisar los cambios. Si se edita en Google, hay que traer el cambio al archivo, y al revés. El **texto** de los mails no está en el código sino en una pestaña del Sheet (`plantillas-mail`), justamente para poder cambiarlo sin volver a desplegar el script.

### Animaciones

`framer-motion` con presets centralizados en `src/motion.js`: `fadeUp`, `fadeIn`, `stagger`, `sectionTransition`, `inViewProps`. Reutilizá estos en vez de definir variants ad-hoc por componente.

### Tailwind: paleta y tipografías

`tailwind.config.js` extiende el theme con la paleta de marca (`ink`, `graphite`, `taupe`, `mute`, `bone`, `parchment`, `linen`, `accent`) y tres familias: `font-serif` (Instrument Serif), `font-sans` (Inter Tight), `font-mono` (JetBrains Mono).

**Las fuentes se sirven desde el propio sitio**, no desde Google Fonts: los `.woff2` (subconjunto `latin`) están en `public/fonts/` y las reglas `@font-face` al principio de `src/index.css`. Pedirlas a Google armaba una cadena serializada (documento → CSS en `fonts.googleapis.com` → woff2 en `fonts.gstatic.com`) que bloqueaba el render ~1,5 s, y además implicaba un pedido a servidores de Google en cada visita. Tres detalles que hay que respetar:

- Inter Tight y JetBrains Mono son **fuentes variables**: un archivo cubre todos los pesos, por eso el `@font-face` declara `font-weight: <min> <max>`. Con un peso suelto, los demás saldrían simulados.
- `index.html` **precarga** las dos que aparecen de entrada. El atributo `crossorigin` es obligatorio aunque sean del mismo dominio — sin él la precarga se descarta y el archivo se baja dos veces.
- `public/_headers` las cachea como `immutable` por un año. Si se reemplaza una fuente hay que **cambiarle el nombre al archivo**, no pisarlo.

Sombras de marca: `shadow-card`, `shadow-cardHover`, `shadow-cta`.

Utilidades custom en `src/index.css`: `.eyebrow` (caps espaciadas) y `.mono-tag`.

## Notas operativas

- **SPA fallback en Netlify**: resuelto con `public/_redirects` (`/* /index.html 200`). Vite lo copia a `dist/` en el build y Netlify lo aplica, de modo que cargar `/psicologos` directamente o refrescar devuelve el `index.html` de la SPA en vez de 404. No borrar este archivo.
- **Fotos de las directoras**: lo publicado vive en `public/team/`, con **dos medidas por directora** (`-bio.jpg` 400×480 para `/`, `-bio-sm.jpg` 224×280 para `/psicologos`). Se entregan ya en el tamaño en que se muestran, al doble por retina: si el navegador tiene que achicarlas, su filtro barato produce muaré en los estampados finos. **Si se reemplaza una foto hay que regenerar las dos medidas**, no alcanza con pisar una. Los archivos en alta están en `originales/`, fuera de `public/` para que no se publiquen; el recorte exacto de cada una y la receta para regenerarlas están en `originales/LEEME.md`.
- **Branch de deploy**: `main`. Push a `main` → rebuild automático en Netlify.
- **No commitear `.claude/`** — está en `.gitignore`, es estado local de Claude Code.
