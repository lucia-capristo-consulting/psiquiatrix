// GENERADOR DE LOS ARCHIVOS DE LAS TARJETAS DIGITALES.
//
// No corre en el build: se ejecuta a mano cuando se suma una directora o
// cambian sus datos.
//
//   npm install --no-save qrcode jsqr sharp wawoff2 opentype.js
//   node scripts/generar-tarjetas.cjs
//
// Produce, por cada tarjeta, tres archivos en public/tarjetas/:
//
//   <slug>.jpg        la foto recortada para el encabezado de la pagina
//   qr-<slug>.svg     el QR que ella muestra en el celular
//   <nombre>.vcf      el contacto para agendar
//
// El QR se LEE despues de generarlo. Lleva la "x" de la marca en el medio, y
// tapar parte de un QR es exactamente lo que lo puede volver ilegible: hay que
// comprobarlo, no confiar en que el margen de error alcanza.

const QRCode = require(process.cwd() + '/node_modules/qrcode');
const jsQR = require(process.cwd() + '/node_modules/jsqr');
const sharp = require(process.cwd() + '/node_modules/sharp');
const woff2 = require(process.cwd() + '/node_modules/wawoff2');
const opentype = require(process.cwd() + '/node_modules/opentype.js');
const fs = require('fs');

const SITIO = 'https://www.psiquiatrix.ar';
const SALIDA = 'public/tarjetas';
const GRAPHITE = '#3C3833';
const ACCENT = '#B8541F';
const BONE = '#F2EDE4';

// Lo unico que vive aca es COMO generar los archivos. El nombre, el telefono,
// el mail y el resto salen de src/contenido/tarjetas.js, que es el archivo que
// se edita a mano.
//
// Antes estaban duplicados en los dos lados y era una trampa: cambiar el
// telefono en uno solo dejaba la pagina diciendo una cosa y el contacto
// descargable otra, sin ningun aviso.
const GENERACION = {
  amanda: {
    original: 'originales/amanda-villaverde.jpg',
    // Recorte del encabezado. Se elige a mano mirando la foto: arranca un poco
    // abajo del borde superior para que la cara quede alta pero no pegada.
    recorte: { left: 0, top: 60, width: 1023, height: 920 },
  },
};

// "Amanda Villaverde" -> { nombre: 'Amanda', apellido: 'Villaverde' }, que es
// como lo quiere una agenda de contactos. Si algun apellido compuesto se parte
// mal, se declara `agenda: { nombre, apellido }` en tarjetas.js y manda eso.
function partirNombre(t) {
  if (t.agenda) return t.agenda;
  const partes = t.nombre.trim().split(/\s+/);
  return { nombre: partes.slice(0, -1).join(' '), apellido: partes[partes.length - 1] };
}

// --- QR con la "x" de la marca en el centro ---------------------------------

const interiorSvg = (svg) =>
  svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();

const viewBox = (svg) => {
  const [, , w, h] = svg.match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number);
  return { w, h };
};

async function decodifica(buf, ancho) {
  const { data, info } = await sharp(buf)
    .resize({ width: ancho })
    .flatten({ background: '#FFFFFF' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const r = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  return r ? r.data : null;
}

async function armarQr(destino, italica) {
  const W = 1000;
  // Correccion H (30%): es la mas alta que existe y la que permite tapar el
  // centro con el isotipo sin perder la lectura.
  const qrSvg = await QRCode.toString(destino, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 4, // zona de silencio que exige el estandar
    color: { dark: GRAPHITE + 'FF', light: BONE + 'FF' },
  });
  const escala = W / viewBox(qrSvg).w;

  // El recuadro del centro ocupa un 24% del ancho, o sea menos del 6% del area.
  // Muy por debajo del 30% que tolera la correccion H, con margen de sobra para
  // que ademas siga leyendose sucio o torcido.
  const lado = W * 0.24;
  const x0 = (W - lado) / 2;

  // La "x" se saca de la tipografia real del sitio y se convierte a curvas.
  const glifo = italica.charToGlyph('x');
  const cuerpo = lado * 0.78;
  const anchoX = (glifo.advanceWidth / italica.unitsPerEm) * cuerpo;
  const capX = ((italica.tables.os2 && italica.tables.os2.sxHeight) || italica.unitsPerEm * 0.45) /
    italica.unitsPerEm * cuerpo;
  const d = glifo.getPath(0, 0, cuerpo).toPathData(2);
  if (d.includes('NaN')) throw new Error('El glifo de la x salio con NaN');

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="Código QR de ${destino}">\n` +
    `  <rect width="${W}" height="${W}" fill="${BONE}"/>\n` +
    `  <g transform="scale(${escala})">\n    ${interiorSvg(qrSvg)}\n  </g>\n` +
    `  <rect x="${x0.toFixed(1)}" y="${x0.toFixed(1)}" width="${lado.toFixed(1)}" height="${lado.toFixed(1)}" rx="${(lado * 0.22).toFixed(1)}" fill="${BONE}"/>\n` +
    `  <path transform="translate(${(W / 2 - anchoX / 2).toFixed(1)} ${(W / 2 + capX / 2).toFixed(1)})" fill="${ACCENT}" d="${d}"/>\n` +
    `</svg>\n`;

  if (svg.includes('NaN')) throw new Error('El SVG del QR contiene NaN');
  return svg;
}

// --- Contacto para la agenda ------------------------------------------------

// vCard 3.0 y no 4.0: es la que abren sin chistar tanto iPhone como Android.
// Las lineas van separadas con CRLF porque asi lo pide la norma y hay lectores
// que con saltos sueltos no lo reconocen.
function armarVcard(t, url) {
  const { nombre, apellido } = partirNombre(t);
  const lineas = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${apellido};${nombre};;Dra.;`,
    `FN:Dra. ${nombre} ${apellido}`,
    `TITLE:${t.titulo}`,
    'ORG:PsiquiatriX',
    `TEL;TYPE=CELL,VOICE:${t.contacto.telefono.replace(/[^\d+]/g, '')}`,
    `EMAIL;TYPE=INTERNET:${t.contacto.mail}`,
    `URL:${url}`,
    `NOTE:${t.matricula} — ${t.rol}`,
    'END:VCARD',
  ];
  return lineas.join('\r\n') + '\r\n';
}

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });

  const cargar = async (p) =>
    opentype.parse(Uint8Array.from(await woff2.decompress(fs.readFileSync(p))).buffer);
  const serif = await cargar('public/fonts/instrument-serif-latin.woff2');
  const sans = await cargar('public/fonts/inter-tight-latin.woff2');
  const italica = opentype.parse(
    Uint8Array.from(
      await woff2.decompress(fs.readFileSync('public/fonts/instrument-serif-italic-latin.woff2'))
    ).buffer
  );

  // Los datos salen del mismo archivo que usa la web. Import dinamico porque
  // aquel es un modulo ES y este script es CommonJS.
  const { TARJETAS } = await import('../src/contenido/tarjetas.js');

  for (const t of TARJETAS) {
    const gen = GENERACION[t.slug];
    if (!gen) {
      console.log(t.slug + ': falta declararla en GENERACION (que foto usar y como recortarla)');
      continue;
    }
    const destino = `${SITIO}/${t.slug}`;

    // 1. Foto del encabezado.
    const foto = `${SALIDA}/${t.slug}.jpg`;
    await sharp(gen.original)
      .extract(gen.recorte)
      .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(foto);

    // 2. QR con el isotipo al centro.
    const svg = await armarQr(destino, italica);
    const qrSvg = `${SALIDA}/qr-${t.slug}.svg`;
    const qrPng = `${SALIDA}/qr-${t.slug}.png`;
    fs.writeFileSync(qrSvg, svg);
    await sharp(Buffer.from(svg), { density: 288 }).resize({ width: 1200 }).png().toFile(qrPng);

    // 3. Contacto para agendar.
    const vcf = `${SALIDA}/${t.vcard.split('/').pop()}`;
    fs.writeFileSync(vcf, armarVcard(t, destino), 'utf8');

    console.log(t.slug + ' -> ' + destino);
    for (const f of [foto, qrSvg, qrPng, vcf]) {
      console.log('   ' + f.padEnd(44) + (fs.statSync(f).size / 1024).toFixed(1) + ' kB');
    }

    // 4. Imagen de preview para cuando se comparta el link de la tarjeta.
    await generarOgTarjeta(t, { serif: serif, sans: sans, italica: italica });

    // Tapar el centro de un QR es justo lo que lo puede romper: se comprueba.
    for (const [etq, buf, ancho] of [
      ['SVG 1000px', fs.readFileSync(qrSvg), 1000],
      ['SVG  360px', fs.readFileSync(qrSvg), 360],
      ['PNG  600px', fs.readFileSync(qrPng), 600],
    ]) {
      const leido = await decodifica(buf, ancho);
      console.log('   ' + etq + ' -> ' + (leido === destino ? 'OK' : 'FALLA: ' + leido));
      if (leido !== destino) process.exitCode = 1;
    }
  }
})();

// ---------------------------------------------------------------------------
// IMAGEN DE PREVIEW DE LA TARJETA
// ---------------------------------------------------------------------------
// El link de la tarjeta se comparte por WhatsApp, asi que su preview importa
// tanto como la pagina. Lleva la foto a la derecha y los datos a la izquierda:
// al compartir el contacto de una persona, la cara es lo que se reconoce
// primero.
//
// Se arma en dos pasos, no en uno: primero se rasteriza el fondo con el texto,
// y despues se PEGA la foto encima con sharp. Meter la foto adentro del SVG
// obligaria a incrustarla en base64, que infla el archivo y no aporta nada.

const OG_W = 1200;
const OG_H = 630;
const OG_MARGEN = 84;
const OG_FOTO_W = 470;
const TAUPE = '#7A6F5E';
const PARCHMENT = '#E9DFCC';

// Mismo criterio que en generar-og.cjs: cada glifo se dibuja en el origen y se
// ubica con un transform, y si aparece un NaN se reintenta con el cuerpo
// corrido un pelo. Los dos problemas estan explicados alla en detalle.
function trazoGlifo(glifo, size) {
  for (const s of [size, Math.round(size * 100) / 100, size + 0.01, size - 0.01]) {
    const d = glifo.getPath(0, 0, s).toPathData(2);
    if (!d.includes('NaN')) return d;
  }
  throw new Error('No se pudo dibujar un glifo sin NaN a cuerpo ' + size);
}

function lineaOg(font, texto, size, x, y, color) {
  const glifos = [...texto].map((ch) => font.charToGlyph(ch));
  let cursor = x;
  const paths = [];
  for (let i = 0; i < glifos.length; i++) {
    const d = trazoGlifo(glifos[i], size);
    if (d.length > 2) {
      paths.push(
        `<path transform="translate(${cursor.toFixed(2)} ${y.toFixed(2)})" fill="${color}" d="${d}"/>`
      );
    }
    cursor += (glifos[i].advanceWidth / font.unitsPerEm) * size;
    if (i + 1 < glifos.length) {
      const k = font.getKerningValue(glifos[i], glifos[i + 1]);
      if (k) cursor += (k / font.unitsPerEm) * size;
    }
  }
  return { paths: paths.join('\n  '), ancho: cursor - x };
}

async function generarOgTarjeta(t, fuentes) {
  const anchoTexto = OG_W - OG_FOTO_W - OG_MARGEN * 2;
  const cap = (f, size) =>
    (((f.tables.os2 && f.tables.os2.sCapHeight) || f.unitsPerEm * 0.7) / f.unitsPerEm) * size;

  const partes = [];
  let y = 214;

  const nombre = lineaOg(fuentes.serif, t.nombre, 58, OG_MARGEN, y, GRAPHITE);
  partes.push(nombre.paths);

  y += 44;
  partes.push(`<rect x="${OG_MARGEN}" y="${y}" width="64" height="2" fill="${ACCENT}"/>`);

  y += 2 + 40 + cap(fuentes.serif, 30);
  partes.push(lineaOg(fuentes.serif, t.titulo, 30, OG_MARGEN, y, ACCENT).paths);

  y += 42;
  partes.push(lineaOg(fuentes.sans, t.rol, 20, OG_MARGEN, y, GRAPHITE).paths);

  partes.push(
    lineaOg(fuentes.sans, `www.psiquiatrix.ar/${t.slug}`, 18, OG_MARGEN, OG_H - OG_MARGEN, TAUPE).paths
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">
  <defs>
    <linearGradient id="f" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BONE}"/>
      <stop offset="1" stop-color="${PARCHMENT}"/>
    </linearGradient>
  </defs>
  <rect width="${OG_W}" height="${OG_H}" fill="url(#f)"/>
  ${partes.join('\n  ')}
</svg>
`;
  if (svg.includes('NaN')) throw new Error('El SVG del preview contiene NaN');
  if (nombre.ancho > anchoTexto) console.log('   OJO: el nombre se pasa del ancho de texto');

  const foto = await sharp(GENERACION[t.slug].original)
    .resize(OG_FOTO_W, OG_H, { fit: 'cover', position: 'top' })
    .toBuffer();

  const salida = `public/og-${t.slug}.jpg`;
  await sharp(Buffer.from(svg), { density: 288 })
    .resize(OG_W * 2, OG_H * 2)
    .resize(OG_W, OG_H, { kernel: 'lanczos3' })
    .composite([{ input: foto, left: OG_W - OG_FOTO_W, top: 0 }])
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(salida);

  console.log('   ' + salida.padEnd(44) + (fs.statSync(salida).size / 1024).toFixed(1) + ' kB');
}
