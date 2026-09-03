/**
 * Genera dist/marca/index.html: un listado navegable de public/marca/.
 *
 * Netlify no arma listados de carpeta solo. Sin un index.html adentro, entrar
 * a /marca/ cae en el fallback de _redirects que devuelve la SPA y muestra la
 * home, que no es lo que espera quien recibio el link.
 *
 * Corre despues de `vite build` (encadenado en el script `build`) y lee
 * dist/marca/, ya copiada desde public/. Descubre los archivos en cada build:
 * para sumar un logo alcanza con dejarlo en public/marca/, no hay que tocar
 * este script. Si querés que tenga un titulo prolijo, sumalo a LABELS.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'dist/marca';

const LABELS = {
  'logo-psiquiatrix': 'Logotipo principal',
  'logo-psiquiatrix-transparente': 'Logotipo sin fondo',
  'logo-psiquiatrix-mini': 'Isotipo para foto de perfil',
};

const TIPOS = {
  '.svg': {
    nombre: 'SVG',
    nota: 'Vectorial. Escala a cualquier tamaño sin perder definición. Es el que hay que mandar a la imprenta.',
  },
  '.png': {
    nombre: 'PNG',
    nota: 'Mapa de bits. Para usos digitales rápidos: mail, presentaciones, redes.',
  },
  '.jpg': {
    nombre: 'JPEG',
    nota: 'Mapa de bits sin transparencia. Pensado para donde piden una imagen cuadrada, como la foto de perfil de una red social.',
  },
};
TIPOS['.jpeg'] = TIPOS['.jpg'];

const pngSize = (buf) =>
  buf.length > 24 && buf.readUInt32BE(12) === 0x49484452
    ? { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
    : null;

// El tamaño de un JPEG está en el marcador SOF, que hay que ir a buscar
// saltando de segmento en segmento: no está a un offset fijo como en PNG.
const jpegSize = (buf) => {
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marcador = buf[i + 1];
    const esSOF =
      marcador >= 0xc0 && marcador <= 0xcf &&
      marcador !== 0xc4 && marcador !== 0xc8 && marcador !== 0xcc;
    if (esSOF) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
};

const svgSize = (txt) => {
  const vb = txt.match(/viewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/i);
  if (vb) return { w: Math.round(+vb[1]), h: Math.round(+vb[2]) };
  const w = txt.match(/\swidth\s*=\s*["'](\d+)/i);
  const h = txt.match(/\sheight\s*=\s*["'](\d+)/i);
  return w && h ? { w: +w[1], h: +h[1] } : null;
};

const peso = (n) => (n < 1024 ? n + ' B' : (n / 1024).toFixed(0) + ' kB');

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const prettify = (base) => base.replace(/[-_]/g, ' ').replace(/^./, (c) => c.toUpperCase());

if (!existsSync(DIR)) {
  console.log('[marca] no existe dist/marca/, se saltea');
  process.exit(0);
}

// Agrupa por nombre sin extension: un mismo logo con sus distintos formatos.
const grupos = new Map();
for (const file of readdirSync(DIR).sort()) {
  if (file === 'index.html') continue;
  const punto = file.lastIndexOf('.');
  if (punto < 1) continue;
  const base = file.slice(0, punto);
  const ext = file.slice(punto).toLowerCase();
  const buf = readFileSync(join(DIR, file));
  const dim =
    ext === '.png'
      ? pngSize(buf)
      : ext === '.svg'
        ? svgSize(buf.toString('utf8'))
        : ext === '.jpg' || ext === '.jpeg'
          ? jpegSize(buf)
          : null;
  if (!grupos.has(base)) grupos.set(base, []);
  grupos.get(base).push({ file, ext, bytes: buf.length, dim });
}

const cards = [...grupos.entries()]
  .map(([base, archivos]) => {
    const transparente = /transparente|sin-fondo/i.test(base);
    // Para la vista previa preferimos el SVG, que se ve nitido a cualquier tamaño.
    const preview = (archivos.find((a) => a.ext === '.svg') || archivos[0]).file;
    const titulo = LABELS[base] || prettify(base);

    const filas = archivos
      .map((a) => {
        const t = TIPOS[a.ext] || { nombre: a.ext.slice(1).toUpperCase(), nota: '' };
        const dim = a.dim ? a.dim.w + ' × ' + a.dim.h : '—';
        return [
          '<li class="fila">',
          '  <div class="fila-datos">',
          '    <span class="formato">' + esc(t.nombre) + '</span>',
          '    <span class="meta">' + dim + ' · ' + peso(a.bytes) + '</span>',
          t.nota ? '    <p class="nota">' + esc(t.nota) + '</p>' : '',
          '  </div>',
          '  <div class="fila-acciones">',
          '    <a class="btn" href="./' + esc(a.file) + '" download>Descargar</a>',
          '    <a class="btn btn-ghost" href="./' + esc(a.file) + '" target="_blank" rel="noopener">Abrir</a>',
          '  </div>',
          '</li>',
        ]
          .filter(Boolean)
          .join('\n');
      })
      .join('\n');

    return [
      '<article class="card">',
      '  <div class="preview' + (transparente ? ' preview-alpha' : '') + '">',
      '    <img src="./' + esc(preview) + '" alt="' + esc(titulo) + '" loading="lazy" />',
      '  </div>',
      '  <div class="card-cuerpo">',
      '    <h2>' + esc(titulo) + '</h2>',
      '    <p class="archivo">' + esc(base) + '</p>',
      '    <ul class="formatos">',
      filas,
      '    </ul>',
      '  </div>',
      '</article>',
    ].join('\n');
  })
  .join('\n');

const total = [...grupos.values()].flat().length;
const versiones = grupos.size;

const html = `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Archivos de marca · PsiquiatriX</title>
<style>
  @font-face { font-family:'Inter Tight'; font-weight:300 700; font-display:swap; src:url('/fonts/inter-tight-latin.woff2') format('woff2'); }
  @font-face { font-family:'Instrument Serif'; font-weight:400; font-display:swap; src:url('/fonts/instrument-serif-latin.woff2') format('woff2'); }
  @font-face { font-family:'JetBrains Mono'; font-weight:300 700; font-display:swap; src:url('/fonts/jetbrains-mono-latin.woff2') format('woff2'); }

  :root { --graphite:#3C3833; --taupe:#7A6F5E; --bone:#F2EDE4; --parchment:#E9DFCC; --linen:#D9CFB8; --accent:#B8541F; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bone); color:var(--graphite); font-family:'Inter Tight',system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
  .wrap { max-width:1080px; margin:0 auto; padding:64px 24px 96px; }

  .eyebrow { font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:var(--accent); font-weight:600; }
  h1 { font-family:'Instrument Serif',serif; font-weight:400; font-size:clamp(38px,6vw,56px); line-height:1.05; letter-spacing:-.025em; margin:18px 0 0; }
  .bajada { font-size:15.5px; line-height:1.7; max-width:60ch; margin:20px 0 0; }

  .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:1px; background:var(--linen); border:1px solid var(--linen); margin-top:56px; }
  .card { background:var(--bone); display:flex; flex-direction:column; }
  .preview { display:flex; align-items:center; justify-content:center; padding:40px 32px; background:var(--parchment); border-bottom:1px solid var(--linen); min-height:180px; }
  .preview img { max-width:100%; height:auto; max-height:120px; }
  /* Damero, para que se lea que el fondo es transparente y no blanco. */
  .preview-alpha { background-color:#fff;
    background-image:linear-gradient(45deg,#e6e0d4 25%,transparent 25%),linear-gradient(-45deg,#e6e0d4 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e6e0d4 75%),linear-gradient(-45deg,transparent 75%,#e6e0d4 75%);
    background-size:16px 16px; background-position:0 0,0 8px,8px -8px,-8px 0; }
  .card-cuerpo { padding:28px 28px 32px; }
  .card h2 { font-family:'Instrument Serif',serif; font-weight:400; font-size:26px; line-height:1.15; letter-spacing:-.015em; margin:0; }
  .archivo { font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.08em; color:var(--taupe); margin:8px 0 0; }

  .formatos { list-style:none; margin:22px 0 0; padding:0; }
  .fila { display:flex; gap:16px; align-items:flex-start; justify-content:space-between; padding:16px 0; border-top:1px solid var(--linen); flex-wrap:wrap; }
  .formato { font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700; letter-spacing:.06em; }
  .meta { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--taupe); margin-left:10px; }
  .nota { font-size:13px; line-height:1.6; color:var(--taupe); margin:8px 0 0; max-width:34ch; }
  .fila-acciones { display:flex; gap:8px; flex-shrink:0; }
  .btn { display:inline-block; font-size:12.5px; font-weight:600; text-decoration:none; padding:8px 14px; border:1px solid var(--graphite); background:var(--graphite); color:var(--bone); transition:background .25s,color .25s,border-color .25s; }
  .btn:hover { background:var(--accent); border-color:var(--accent); }
  .btn-ghost { background:transparent; color:var(--graphite); }
  .btn-ghost:hover { background:transparent; color:var(--accent); }

  .pie { margin-top:56px; padding-top:32px; border-top:1px solid var(--linen); font-size:14px; line-height:1.75; color:var(--taupe); max-width:65ch; }
  .pie strong { color:var(--graphite); font-weight:600; }
  .pie a { color:var(--accent); }
  .conteo { font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.18em; text-transform:uppercase; color:var(--taupe); margin-top:40px; }
</style>
</head>
<body>
  <div class="wrap">
    <span class="eyebrow">PsiquiatriX · Archivos de marca</span>
    <h1>Logotipo</h1>
    <p class="bajada">
      Archivos oficiales para uso en piezas impresas y digitales. El texto está
      convertido a curvas, así que no hace falta tener instalada la tipografía
      Instrument Serif para abrirlos ni para imprimirlos.
    </p>

    <div class="grid">
${cards}
    </div>

    <div class="pie">
      <p><strong>¿Cuál mando a la imprenta?</strong> El SVG. Es vectorial: se amplía
      a cualquier tamaño sin perder nitidez, desde una tarjeta personal hasta una
      gigantografía. El PNG conviene reservarlo para pantalla.</p>
      <p><strong>¿Con fondo o sin fondo?</strong> La versión con fondo trae el color
      de marca integrado. La transparente sirve para apoyar el logo sobre una foto o
      sobre un color propio; conviene usarla sobre fondos claros, para que el texto
      en gris oscuro mantenga contraste.</p>
      <p style="margin-top:24px"><a href="/">← Volver a psiquiatrix.ar</a></p>
      <p class="conteo">${total} archivo${total === 1 ? '' : 's'} · ${versiones} versi${versiones === 1 ? 'ón' : 'ones'}</p>
    </div>
  </div>
</body>
</html>
`;

writeFileSync(join(DIR, 'index.html'), html);
console.log(
  '[marca] /marca/     -> ' + DIR + '/index.html (' + total + ' archivos, ' + versiones + ' versiones)'
);
