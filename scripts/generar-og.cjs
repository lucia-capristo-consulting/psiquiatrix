// GENERADOR DE LAS IMAGENES DE OPEN GRAPH (las que se ven al compartir un link
// en WhatsApp, Facebook, LinkedIn o Telegram).
//
// No corre en el build: se ejecuta a mano cuando cambian los textos, el
// logotipo o el dominio.
//
//   npm install --no-save sharp wawoff2 opentype.js
//   node scripts/generar-og.cjs
//
// Las dependencias NO estan en package.json a proposito: se usan una vez cada
// tanto y no tienen por que pesar en la instalacion del proyecto.
//
// Todo el texto se convierte a CURVAS leyendo los .woff2 que sirve el propio
// sitio. Asi la pieza no depende de tener las tipografias instaladas y el
// resultado es identico al de la web, con el mismo interletrado y kerning.

const sharp = require(process.cwd() + '/node_modules/sharp');
const woff2 = require(process.cwd() + '/node_modules/wawoff2');
const opentype = require(process.cwd() + '/node_modules/opentype.js');
const fs = require('fs');

// --- Marca ------------------------------------------------------------------
const GRAPHITE = '#3C3833';
const ACCENT = '#B8541F';
const TAUPE = '#7A6F5E';
const BONE = '#F2EDE4';
const PARCHMENT = '#E9DFCC';

const LOGO = 'public/marca/logo-psiquiatrix-transparente.svg';
const FUENTES = {
  serif: 'public/fonts/instrument-serif-latin.woff2',
  serifItalica: 'public/fonts/instrument-serif-italic-latin.woff2',
  sans: 'public/fonts/inter-tight-latin.woff2',
};

// --- Lienzo -----------------------------------------------------------------
// 1200x630 es la medida canonica de Open Graph (proporcion 1.91:1). Es la que
// esperan todos los scrapers y la que evita que recorten por su cuenta.
const W = 1200;
const H = 630;

// Margen seguro. Los previews chicos de algunos clientes recortan hacia el
// centro, asi que nada importante puede vivir en el borde. 96 px es el 8% del
// ancho: suficiente para que nada quede al filo y para que la pieza respire.
const MARGEN = 96;

// --- Piezas -----------------------------------------------------------------
const PIEZAS = [
  {
    archivo: 'public/og-psiquiatrix.jpg',
    frase: [
      { texto: 'Psiquiatría online con ', estilo: 'serif', color: GRAPHITE },
      { texto: 'mirada humana', estilo: 'serifItalica', color: ACCENT },
    ],
    url: 'www.psiquiatrix.ar',
  },
  {
    archivo: 'public/og-psiquiatrix-psicologos.jpg',
    frase: [
      { texto: 'Derivá y ', estilo: 'serif', color: GRAPHITE },
      { texto: 'seguí en la conversación', estilo: 'serifItalica', color: ACCENT },
    ],
    url: 'www.psiquiatrix.ar/psicologos',
  },
];

// --- Medidas tipograficas ---------------------------------------------------
const LOGO_W = 520; // el logotipo es el elemento mas grande de la pieza
const FRASE = 58;   // intermedio: menor que el logotipo, mayor que la URL
const URL_TAM = 22;
const REGLA_W = 72;
const REGLA_H = 2;

// Aire entre bloques. Mas amplio arriba (logotipo -> regla) que abajo
// (regla -> frase), para que la regla se lea como parte del bloque de texto y
// no como una linea suelta en el medio de la nada.
// El logotipo trae espacio propio debajo (la caja incluye el descendente de
// la q), asi que el aire declarado aca es MENOR que el que se ve.
const AIRE_LOGO_REGLA = 58;
const AIRE_REGLA_FRASE = 46;

const cargarFuente = async (ruta) =>
  opentype.parse(Uint8Array.from(await woff2.decompress(fs.readFileSync(ruta))).buffer);

const interiorSvg = (svg) =>
  svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();

const viewBox = (svg) => {
  const [, , w, h] = svg.match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number);
  return { w, h };
};

/**
 * Convierte una linea con varios tramos (distinta fuente y color cada uno) a
 * curvas.
 *
 * Se compone glifo por glifo y NO con font.getPath(texto): esa via hace pasar
 * la cadena por el motor de features de opentype, que se rompe con una tabla
 * de sustitucion que trae Instrument Serif ("lookupType: 6 substFormat: 2 is
 * not yet supported").
 *
 * Como consecuencia hay que aplicar el kerning a mano, par por par: sin eso,
 * combinaciones como "Ps" o "ía" quedan visiblemente mal espaciadas.
 */
// Tope de seguridad para el atributo `d` de un trazo.
//
// El rasterizador corta el dibujo, sin avisar, cuando un solo `d` se pasa de
// unos 18.000 caracteres: la frase aparecia completa en el SVG y en la imagen
// terminaba a mitad de una palabra. Se descubrio porque la misma frase
// arrancando en x=0 se dibujaba entera (18.070 caracteres) y arrancando en
// x=267 no (18.480): lo unico que cambiaba era el largo de las coordenadas.
//
// Por eso cada letra va en su propio <path> y ademas se verifica el largo.
const TOPE_D = 12000;

function tramoACurvas(font, texto, size, x, y, color) {
  const glifos = [...texto].map((ch) => font.charToGlyph(ch));
  let cursor = x;
  const paths = [];
  for (let i = 0; i < glifos.length; i++) {
    const d = glifos[i].getPath(cursor, y, size).toPathData(2);
    if (d.length > 2) {
      if (d.length > TOPE_D) throw new Error('Trazo demasiado largo: ' + d.length);
      paths.push(`<path fill="${color}" d="${d}"/>`);
    }
    cursor += (glifos[i].advanceWidth / font.unitsPerEm) * size;
    if (i + 1 < glifos.length) {
      const kern = font.getKerningValue(glifos[i], glifos[i + 1]);
      if (kern) cursor += (kern / font.unitsPerEm) * size;
    }
  }
  return { paths, ancho: cursor - x };
}

function lineaACurvas(tramos, fuentes, size, x, y) {
  let cursor = x;
  const paths = [];
  for (const t of tramos) {
    const r = tramoACurvas(fuentes[t.estilo], t.texto, size, cursor, y, t.color);
    paths.push(...r.paths);
    cursor += r.ancho;
  }
  return { paths: paths.join('\n  '), ancho: cursor - x };
}

(async () => {
  const fuentes = {
    serif: await cargarFuente(FUENTES.serif),
    serifItalica: await cargarFuente(FUENTES.serifItalica),
    sans: await cargarFuente(FUENTES.sans),
  };

  const logoSvg = fs.readFileSync(LOGO, 'utf8');
  const logoVb = viewBox(logoSvg);
  const escalaLogo = LOGO_W / logoVb.w;
  const logoH = logoVb.h * escalaLogo;

  // Altura de mayuscula y de la "x": se usan para alinear por el DIBUJO de la
  // letra y no por la caja de la fuente, que trae aire arriba y abajo y
  // desbalancea la composicion.
  const alturaMayuscula = (f, size) =>
    ((f.tables.os2 && f.tables.os2.sCapHeight) || f.unitsPerEm * 0.7) / f.unitsPerEm * size;

  const capFrase = alturaMayuscula(fuentes.serif, FRASE);
  const capUrl = alturaMayuscula(fuentes.sans, URL_TAM);

  for (const p of PIEZAS) {
    // Bloque de arriba: logotipo, regla, frase. Se apila desde el margen.
    const logoY = MARGEN;
    const reglaY = logoY + logoH + AIRE_LOGO_REGLA;
    const fraseBase = reglaY + REGLA_H + AIRE_REGLA_FRASE + capFrase;
    // La URL se ancla al margen inferior, no al flujo: asi queda a la misma
    // altura en las dos piezas aunque la frase cambie de largo.
    const urlBase = H - MARGEN;

    const frase = lineaACurvas(p.frase, fuentes, FRASE, MARGEN, fraseBase);
    const url = lineaACurvas(
      [{ texto: p.url, estilo: 'sans', color: TAUPE }],
      fuentes,
      URL_TAM,
      MARGEN,
      urlBase
    );

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BONE}"/>
      <stop offset="1" stop-color="${PARCHMENT}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fondo)"/>
  <g transform="translate(${MARGEN} ${logoY}) scale(${escalaLogo})">
    ${interiorSvg(logoSvg)}
  </g>
  <rect x="${MARGEN}" y="${reglaY}" width="${REGLA_W}" height="${REGLA_H}" fill="${ACCENT}"/>
  ${frase.paths}
  ${url.paths}
</svg>
`;

    // Se rasteriza al doble y se baja a 1200: el sobremuestreo deja los bordes
    // de las curvas mas limpios que dibujar directo al tamano final.
    await sharp(Buffer.from(svg), { density: 288 })
      .resize(W * 2, H * 2)
      .resize(W, H, { kernel: 'lanczos3' })
      .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(p.archivo);

    const kb = (fs.statSync(p.archivo).size / 1024).toFixed(0);
    console.log(
      p.archivo.padEnd(42) + W + 'x' + H + '  ' + kb + ' kB' +
      '   frase ' + Math.round(frase.ancho) + ' px de ancho'
    );
    if (MARGEN + frase.ancho > W - MARGEN) {
      console.log('   OJO: la frase se pasa del margen seguro.');
    }
  }
})();
