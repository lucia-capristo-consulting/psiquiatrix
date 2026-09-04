// Prerender de metadatos por ruta.
//
// Corre despues de `vite build`. Toma dist/index.html como plantilla y genera
// un HTML por cada ruta declarada en src/seo/pages.js, reescribiendo el bloque
// entre los marcadores <!-- seo:start --> y <!-- seo:end --> con los tags de
// esa ruta.
//
// Por que existe: los scrapers de preview (WhatsApp, Facebook, LinkedIn,
// Telegram) NO ejecutan JavaScript. Leen el HTML crudo que devuelve el
// servidor y se van. Como esto es una SPA, sin prerender todas las rutas
// devolvian el mismo index.html y el preview de /psicologos mostraba el
// titulo de la home.
//
// Esto NO es SSG: el <body> sigue vacio y lo llena React. Solo se prerenderiza
// el <head>, que es lo unico que los scrapers leen.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PAGES } from '../src/seo/pages.js';
import { SITE_URL, SITE_NAME, OG_IMAGE } from '../src/seo/site.js';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const START = '<!-- seo:start -->';
const END = '<!-- seo:end -->';

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// El JSON-LD va dentro de un <script>: hay que neutralizar "<" para que un
// "</script>" en los datos no cierre la etiqueta antes de tiempo.
const jsonForScript = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

function headFor(page) {
  const url = `${SITE_URL}${page.path}`;
  // Este bloque es el que leen WhatsApp y compañia, que no ejecutan
  // JavaScript. Antes la imagen estaba fija en la de la home, asi que una
  // pagina con imagen propia igual mostraba la de la home al compartirla:
  // justo donde mas se nota.
  const img = page.ogImage || OG_IMAGE;
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<link rel="alternate" hreflang="es-AR" href="${esc(url)}" />`,
    ...(page.noindex ? ['<meta name="robots" content="noindex, follow" />'] : []),
    '',
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    '<meta property="og:locale" content="es_AR" />',
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img.url)}" />`,
    `<meta property="og:image:type" content="${esc(img.type)}" />`,
    `<meta property="og:image:width" content="${img.width}" />`,
    `<meta property="og:image:height" content="${img.height}" />`,
    `<meta property="og:image:alt" content="${esc(img.alt)}" />`,
  ];

  if (page.jsonLd) {
    tags.push('');
    tags.push(`<script type="application/ld+json">${jsonForScript(page.jsonLd)}</script>`);
  }

  return tags.map((tag) => (tag ? `    ${tag}` : '')).join('\n');
}

const template = readFileSync(resolve(DIST, 'index.html'), 'utf8');

const from = template.indexOf(START);
const to = template.indexOf(END);
if (from === -1 || to === -1) {
  console.error(
    `[prerender] No encontre los marcadores ${START} / ${END} en dist/index.html.\n` +
      '            Estan en index.html, alrededor del bloque de tags de SEO.'
  );
  process.exit(1);
}

for (const page of PAGES) {
  const html =
    template.slice(0, from + START.length) +
    '\n' +
    headFor(page) +
    '\n    ' +
    template.slice(to);

  writeFileSync(resolve(DIST, page.file), html, 'utf8');
  console.log(`[prerender] ${page.path.padEnd(14)} -> dist/${page.file}`);
}
