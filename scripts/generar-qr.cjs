// GENERADOR DE LOS CODIGOS QR. No corre en el build: se ejecuta a mano cuando
// hay que rehacer las piezas (si cambia el dominio, el logotipo o los textos).
//
//   npm install --no-save qrcode jsqr sharp wawoff2 opentype.js
//   node scripts/generar-qr.cjs
//
// Las dependencias NO estan en package.json a proposito: se usan una vez cada
// tanto y no tienen por que pesar en la instalacion del proyecto.
//
// Escribe las cuatro piezas en public/marca/ y, antes de terminar, LEE cada
// una para confirmar que apunte a donde debe. Generar un QR sin escanearlo es
// como publicar un link sin abrirlo.
//
// Genera TODOS los codigos QR del sitio, para que no se puedan desincronizar.
//
// Cada uno lleva el logotipo debajo y, opcionalmente, una bajada. Se componen
// en SVG: el QR y el logotipo ya son vectores, y la bajada se convierte a
// curvas leyendo la tipografia real del sitio. Asi el archivo no depende de
// tener instalada ninguna fuente y se le puede mandar a una imprenta tal cual.
//
// La bajada usa el estilo del pie del sitio (.mono-tag + text-taupe):
// JetBrains Mono, mayusculas, interletrado 0.18em, color #7A6F5E.
const QRCode = require(process.cwd() + '/node_modules/qrcode');
const jsQR = require(process.cwd() + '/node_modules/jsqr');
const sharp = require(process.cwd() + '/node_modules/sharp');
const woff2 = require(process.cwd() + '/node_modules/wawoff2');
const opentype = require(process.cwd() + '/node_modules/opentype.js');
const fs = require('fs');

const SITIO = 'https://www.psiquiatrix.ar';
const LOGO = 'public/marca/logo-psiquiatrix-transparente.svg';
const FUENTE = 'public/fonts/jetbrains-mono-latin.woff2';
const TAUPE = '#7A6F5E';
const GRAPHITE = '#3C3833';
const INTERLETRADO = 0.18; // em, igual que .mono-tag

// Fondo bone para pantalla; blanco para papel, donde el bone se imprime como
// un gris sucio. Correccion M en pantalla y Q en papel, que se dobla y mancha.
const PANTALLA = { fondo: '#F2EDE4', correccion: 'M', anchoPng: 1080 };
const IMPRESION = { fondo: '#FFFFFF', correccion: 'Q', anchoPng: 2400 };

const PIEZAS = [
  { nombre: 'qr-psiquiatrix', destino: SITIO + '/', ...PANTALLA },
  { nombre: 'qr-psiquiatrix-impresion', destino: SITIO + '/', ...IMPRESION },
  { nombre: 'qr-psicologos', destino: SITIO + '/psicologos', bajada: 'PARA PROFESIONALES', ...PANTALLA },
  { nombre: 'qr-psicologos-impresion', destino: SITIO + '/psicologos', bajada: 'PARA PROFESIONALES', ...IMPRESION },
];

const W = 1000;
const PAD = 30;
const QR = W - PAD * 2;
const HUECO = 70;      // entre el QR y el logotipo
const HUECO_BAJADA = 54;
// El QR trae su propia zona de silencio adentro, asi que arriba el blanco
// visible es bastante mayor que PAD. Abajo hay que compensarlo a mano o la
// pieza queda desbalanceada, con el texto pegado al borde.
const PAD_INFERIOR = 90;
const LOGO_W = 600;
const BAJADA_W = 440;  // mas angosta que el logotipo, para que no compita

const interior = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
const viewBox = (svg) => {
  const m = svg.match(/viewBox="([\d.\s-]+)"/);
  const [, , w, h] = m[1].trim().split(/\s+/).map(Number);
  return { w, h };
};

// Convierte el texto a curvas, glifo por glifo, agregando el interletrado a
// mano: opentype no lo aplica solo.
/**
 * Trazo de un glifo, esquivando un error de opentype: para ciertos cuerpos
 * puntuales devuelve coordenadas NaN en algunos glifos de las fuentes
 * variables. El rasterizador no falla: descarta esos segmentos y rellena el
 * contorno, asi que la letra sale como un bloque solido. Paso con la "E" a
 * cuerpo 31,746. Se reintenta con el cuerpo corrido un pelo, imperceptible.
 */
function trazoDeGlifo(glifo, size) {
  for (const s of [size, Math.round(size * 100) / 100, size + 0.01, size - 0.01]) {
    const d = glifo.getPath(0, 0, s).toPathData(2);
    if (!d.includes('NaN')) return d;
  }
  throw new Error('No se pudo dibujar un glifo sin NaN a cuerpo ' + size);
}

function textoACurvas(font, texto, anchoObjetivo) {
  const upm = font.unitsPerEm;
  let anchoEm = 0;
  for (const ch of texto) anchoEm += font.charToGlyph(ch).advanceWidth / upm;
  anchoEm += INTERLETRADO * (texto.length - 1);

  const size = anchoObjetivo / anchoEm;
  let x = 0;
  const partes = [];
  for (const ch of texto) {
    const g = font.charToGlyph(ch);
    // Cada glifo se dibuja en el origen y se ubica con un transform. Con
    // coordenadas grandes el rasterizador falla en silencio: corta el dibujo
    // o rellena las contraformas. Ver el detalle en scripts/generar-og.cjs.
    const d = trazoDeGlifo(g, size);
    if (d.length > 2) partes.push({ d: d, x: x });
    x += (g.advanceWidth / upm) * size + INTERLETRADO * size;
  }
  const capHeight = (font.tables.os2 && font.tables.os2.sCapHeight) || upm * 0.7;
  return { partes: partes, alto: (capHeight / upm) * size };
}

async function decodificar(buf, ancho, fondo) {
  const { data, info } = await sharp(buf)
    .resize({ width: ancho })
    .flatten({ background: fondo })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const r = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  return r ? r.data : null;
}

(async () => {
  const font = opentype.parse(
    Uint8Array.from(await woff2.decompress(fs.readFileSync(FUENTE))).buffer
  );
  const logoSvg = fs.readFileSync(LOGO, 'utf8');
  const logoVb = viewBox(logoSvg);
  const escalaLogo = LOGO_W / logoVb.w;
  const logoH = logoVb.h * escalaLogo;
  const logoX = (W - LOGO_W) / 2;
  const logoY = PAD + QR + HUECO;

  let todoOk = true;

  for (const p of PIEZAS) {
    const bajada = p.bajada ? textoACurvas(font, p.bajada, BAJADA_W) : null;
    const H = Math.round(
      logoY + logoH + (bajada ? HUECO_BAJADA + bajada.alto : 0) + PAD_INFERIOR
    );

    const qrSvg = await QRCode.toString(p.destino, {
      type: 'svg',
      errorCorrectionLevel: p.correccion,
      margin: 4, // zona de silencio que exige el estandar
      color: { dark: GRAPHITE + 'FF', light: p.fondo + 'FF' },
    });
    const escalaQr = QR / viewBox(qrSvg).w;

    let cuerpo =
      `  <rect width="${W}" height="${H}" fill="${p.fondo}"/>\n` +
      `  <g transform="translate(${PAD} ${PAD}) scale(${escalaQr})">\n    ${interior(qrSvg)}\n  </g>\n` +
      `  <g transform="translate(${logoX} ${logoY}) scale(${escalaLogo})">\n    ${interior(logoSvg)}\n  </g>\n`;

    if (bajada) {
      // La baseline va debajo del logotipo, corrida por la altura de mayuscula.
      const y = logoY + logoH + HUECO_BAJADA + bajada.alto;
      const x = (W - BAJADA_W) / 2;
      cuerpo +=
        bajada.partes
          .map(
            (p) =>
              `  <path transform="translate(${(x + p.x).toFixed(2)} ${y.toFixed(2)})" fill="${TAUPE}" d="${p.d}"/>`
          )
          .join('\n') + '\n';
    }

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Código QR de ${p.destino}">\n` +
      `  <title>PsiquiatriX — ${p.destino}</title>\n` + cuerpo + `</svg>\n`;

    // Ultima red: un NaN no rompe el rasterizado, lo deforma en silencio.
    if (svg.includes('NaN')) throw new Error('El SVG de ' + p.nombre + ' contiene NaN');

    const svgPath = `public/marca/${p.nombre}.svg`;
    const pngPath = `public/marca/${p.nombre}.png`;
    fs.writeFileSync(svgPath, svg);
    await sharp(Buffer.from(svg)).resize({ width: p.anchoPng }).png().toFile(pngPath);

    console.log(p.nombre.padEnd(28) + '-> ' + p.destino);
    // Comprobar, no suponer: el logo y la bajada no pueden romper el codigo.
    for (const [etq, buf, ancho] of [
      ['SVG 1000px', fs.readFileSync(svgPath), 1000],
      ['SVG  400px', fs.readFileSync(svgPath), 400],
      ['PNG  800px', fs.readFileSync(pngPath), 800],
    ]) {
      const leido = await decodificar(buf, ancho, p.fondo);
      const bien = leido === p.destino;
      if (!bien) todoOk = false;
      console.log('   ' + etq + ' -> ' + (bien ? 'OK' : 'FALLA: ' + leido));
    }
  }

  console.log('\n' + (todoOk ? 'Las 4 piezas apuntan a donde corresponde.' : 'HAY UNA FALLA'));
  process.exit(todoOk ? 0 : 1);
})();
