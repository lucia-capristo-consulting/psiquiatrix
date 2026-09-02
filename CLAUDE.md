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
- La imagen de preview es `public/og-psiquiatrix.jpg` (1731×909). Su URL, tipo, dimensiones y alt están declarados una sola vez, en `src/seo/site.js`. Si se reemplaza la imagen, actualizar ahí las dimensiones y listo. En `Seo.jsx` esos tags sólo se emiten cuando `ogImage` es la imagen por defecto: si una página pasa la suya, declarar el tamaño de otra sería incorrecto.
- `HelmetProvider` ya está montado en `src/main.jsx` — no envolver de nuevo.
- Schemas JSON-LD viven en `src/seo/schema.js` (`medicalClinicSchema`, `psicologosServiceSchema`). Si agregás una página nueva, exportá su schema desde ese archivo en vez de inlinearlo.
- `SITE_URL`, `SITE_NAME`, los datos de la imagen OG y el logo (`LOGO`) viven en `src/seo/site.js`, y de ahí los toman `Seo.jsx`, `schema.js`, `pages.js` y el script de prerender. Si cambia el dominio, además hay que tocar `public/sitemap.xml` y `public/robots.txt`, que son estáticos.
- **El dominio primario es `www.psiquiatrix.ar`, con `www`.** El apex (`psiquiatrix.ar`) también resuelve, pero redirige con 301 al `www`. Es una decisión de marca: al ser `.ar` una extensión poco común, el `www` deja claro que es un sitio web y no una red social, y se usa así en tarjetas y material impreso. Por eso los canonical y `og:url` deben llevar `www`: tienen que coincidir con la URL final, no con la que redirige.

- Los archivos de marca (logotipo en SVG y PNG, con fondo y sin fondo) viven en `public/marca/`. El texto está convertido a curvas, así que no dependen de tener instalada Instrument Serif — es lo que permite mandárselos a una imprenta. El campo `logo` del JSON-LD apunta a la versión transparente.

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

### Config de contacto (WhatsApp)

`src/config/contact.js` centraliza el número de WhatsApp (`WA_NUMBER`, solo dígitos, formato internacional sin `+` ni espacios) y los mensajes prellenados (`WA_MESSAGES`). Lo consumen `CTA.jsx` y `FloatingCTA.jsx`. Para cambiar el número o los textos de WhatsApp, editar **solo** este archivo.

### Netlify Forms (importante)

Patrón SPA + Netlify Forms con dos partes que **deben mantenerse sincronizadas**:

1. **Stub estático en `index.html`** con `data-netlify="true"` y todos los `name` de los campos. El bot de Netlify lee este HTML al hacer deploy para registrar el formulario y sus campos. Sin el stub, el form no existe en Netlify aunque el React funcione.
2. **Form interactivo en React** que envía vía `submitNetlifyForm(formName, data)` desde `src/lib/netlifyForm.js`. Hace `POST /` con `application/x-www-form-urlencoded` e incluye `form-name` en el payload.

Forms actuales: `contacto-pacientes` y `contacto-psicologos`. Para agregar uno nuevo: stub en `index.html` con todos los campos + usar el helper desde el componente con el mismo `form-name`.

Para registrar los envíos en un Google Sheet (vía outgoing webhook de Netlify, sin backend ni cambios de código), ver `docs/contactos-google-sheets.md`. Ahí también queda documentado por qué se descartó migrar a Vercel/Next.js.

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
- **Branch de deploy**: `main`. Push a `main` → rebuild automático en Netlify.
- **No commitear `.claude/`** — está en `.gitignore`, es estado local de Claude Code.
