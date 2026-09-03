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

const TARJETAS = [
  {
    slug: 'amanda',
    original: 'originales/amanda-villaverde.jpg',
    // Recorte del encabezado. Se elige a mano mirando la foto: arranca un poco
    // abajo del borde superior para que la cara quede alta pero no pegada.
    recorte: { left: 0, top: 60, width: 1023, height: 920 },
    vcard: {
      archivo: 'amanda-villaverde.vcf',
      apellido: 'Villaverde',
      nombre: 'Amanda',
      prefijo: 'Dra.',
      titulo: 'Médica psiquiatra',
      organizacion: 'PsiquiatriX',
      telefono: '+5491154200104',
      mail: 'psiquiatrix.online@gmail.com',
      nota: 'M.N. 60.654 — Cofundadora y Directora Clínica de PsiquiatriX',
    },
  },
];

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
function armarVcard(v, url) {
  const lineas = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${v.apellido};${v.nombre};;${v.prefijo};`,
    `FN:${v.prefijo} ${v.nombre} ${v.apellido}`,
    `TITLE:${v.titulo}`,
    `ORG:${v.organizacion}`,
    `TEL;TYPE=CELL,VOICE:${v.telefono}`,
    `EMAIL;TYPE=INTERNET:${v.mail}`,
    `URL:${url}`,
    `NOTE:${v.nota}`,
    'END:VCARD',
  ];
  return lineas.join('\r\n') + '\r\n';
}

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });

  const italica = opentype.parse(
    Uint8Array.from(
      await woff2.decompress(fs.readFileSync('public/fonts/instrument-serif-italic-latin.woff2'))
    ).buffer
  );

  for (const t of TARJETAS) {
    const destino = `${SITIO}/${t.slug}`;

    // 1. Foto del encabezado.
    const foto = `${SALIDA}/${t.slug}.jpg`;
    await sharp(t.original)
      .extract(t.recorte)
      .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(foto);

    // 2. QR con el isotipo al centro.
    const svg = await armarQr(destino, italica);
    const qrSvg = `${SALIDA}/qr-${t.slug}.svg`;
    const qrPng = `${SALIDA}/qr-${t.slug}.png`;
    fs.writeFileSync(qrSvg, svg);
    await sharp(Buffer.from(svg), { density: 288 }).resize({ width: 1200 }).png().toFile(qrPng);

    // 3. Contacto para agendar.
    const vcf = `${SALIDA}/${t.vcard.archivo}`;
    fs.writeFileSync(vcf, armarVcard(t.vcard, destino), 'utf8');

    console.log(t.slug + ' -> ' + destino);
    for (const f of [foto, qrSvg, qrPng, vcf]) {
      console.log('   ' + f.padEnd(44) + (fs.statSync(f).size / 1024).toFixed(1) + ' kB');
    }

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
