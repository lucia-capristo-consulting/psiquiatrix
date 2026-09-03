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
const ANCHO_UTIL = W - MARGEN * 2;

// --- Medidas tipograficas ---------------------------------------------------
const LOGO_W = 520; // en la pieza con logotipo, es el elemento mas grande
const FRASE_CON_LOGO = 58; // intermedio: menor que el logotipo, mayor que la URL
// Sin logotipo la frase manda. El tope existe para que no llegue al borde del
// margen seguro: dejarle aire a la derecha se lee mejor que llenar el ancho.
const FRASE_SOLA_TOPE = 84;
const INTERLINEA = 1.12;
const URL_TAM = 22;
const REGLA_W = 72;
const REGLA_H = 2;

// El logotipo trae espacio propio debajo (su caja incluye el descendente de la
// q), asi que el aire declarado aca es MENOR que el que se ve.
const AIRE_LOGO_REGLA = 58;
const AIRE_REGLA_FRASE = 46;
const AIRE_SOBRE_URL = 70;

// --- Piezas -----------------------------------------------------------------
//
// Dos composiciones distintas a proposito. La home se presenta: el logotipo
// manda y la frase acompana. La de psicologos habla: la frase es el mensaje y
// no necesita el logotipo, porque ya dice "Psiquiatrix" adentro.
const PIEZAS = [
  {
    archivo: 'public/og-psiquiatrix.jpg',
    conLogo: true,
    lineas: [
      [
        { texto: 'Psiquiatría online con ', estilo: 'serif', color: GRAPHITE },
        { texto: 'mirada humana', estilo: 'serifItalica', color: ACCENT },
      ],
    ],
    url: 'www.psiquiatrix.ar',
  },
  {
    archivo: 'public/og-psiquiatrix-psicologos.jpg',
    conLogo: false,
    // El H1 de /psicologos, con el mismo tratamiento que en la web: la "x"
    // en italica y color, y la segunda linea entera en italica.
    lineas: [
      [
        { texto: 'Cuando derivás a Psiquiatri', estilo: 'serif', color: GRAPHITE },
        { texto: 'x', estilo: 'serifItalica', color: ACCENT },
        { texto: ',', estilo: 'serif', color: GRAPHITE },
      ],
      [{ texto: 'seguís en la conversación.', estilo: 'serifItalica', color: ACCENT }],
    ],
    url: 'www.psiquiatrix.ar',
  },
];

const cargarFuente = async (ruta) =>
  opentype.parse(Uint8Array.from(await woff2.decompress(fs.readFileSync(ruta))).buffer);

const interiorSvg = (svg) =>
  svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();

const viewBox = (svg) => {
  const [, , w, h] = svg.match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number);
  return { w, h };
};

// Tope de seguridad para el atributo `d` de un trazo. Con el metodo de abajo
// ningun trazo pasa de ~1.500 caracteres, asi que esto es una alarma por si
// alguien vuelve a juntar el texto en un solo path.
const TOPE_D = 12000;

/**
 * Trazo de un glifo, esquivando un error de opentype.
 *
 * Para ciertos cuerpos puntuales, la libreria devuelve coordenadas NaN en
 * algunos glifos de las fuentes variables. El SVG queda con "LNaN-20.57" y el
 * rasterizador, en vez de fallar, DESCARTA esos segmentos y rellena el
 * contorno: la letra sale como un bloque solido. Paso con la "E" de JetBrains
 * Mono a cuerpo 31,746: a 31,74 y a 31,75 anda bien.
 *
 * Por eso, si aparece un NaN se reintenta con el cuerpo corrido un pelo, que
 * es imperceptible. Si ni asi sale limpio, se corta: es preferible no generar
 * la pieza antes que generarla mal.
 */
function trazoDeGlifo(glifo, size) {
  for (const s of [size, Math.round(size * 100) / 100, size + 0.01, size - 0.01]) {
    const d = glifo.getPath(0, 0, s).toPathData(2);
    if (!d.includes('NaN')) return d;
  }
  throw new Error('No se pudo dibujar un glifo sin NaN a cuerpo ' + size);
}

/**
 * Convierte un tramo de texto a curvas.
 *
 * DOS DECISIONES QUE PARECEN RARAS Y NO LO SON. Las dos salieron de errores
 * que el rasterizador NO reporta: dibuja mal y sigue como si nada.
 *
 * 1. Se compone glifo por glifo y no con font.getPath(texto). Esa via hace
 *    pasar la cadena por el motor de features de opentype, que se rompe con
 *    una tabla de sustitucion que trae Instrument Serif ("lookupType: 6
 *    substFormat: 2 is not yet supported"). Como consecuencia el kerning hay
 *    que aplicarlo a mano, par por par: sin eso, pares como "Ps" o "ía"
 *    quedan visiblemente mal espaciados.
 *
 * 2. Cada glifo se dibuja EN EL ORIGEN y se lo ubica con un transform, en vez
 *    de generarlo ya en su coordenada final. Con coordenadas grandes aparecen
 *    dos fallas, las dos silenciosas:
 *
 *      - El dibujo se corta a mitad de palabra cuando un `d` supera unos
 *        18.000 caracteres. La misma frase arrancando en x=0 se dibujaba
 *        entera (18.070) y arrancando en x=267 no (18.480).
 *      - Algunas letras pierden su contraforma y salen como una mancha. Paso
 *        con la "e" de "en" a cuerpo 84: la misma "e" se veia bien en
 *        "conversación", y aislada en esa misma x tambien. Solo fallaba en
 *        contexto.
 *
 *    Dibujando en el origen los numeros quedan chicos y, sobre todo, cada
 *    letra tiene SIEMPRE el mismo trazo: si se ve bien una vez, se ve bien
 *    en cualquier posicion.
 */
function tramoACurvas(font, texto, size, x, y, color) {
  const glifos = [...texto].map((ch) => font.charToGlyph(ch));
  let cursor = x;
  const paths = [];
  for (let i = 0; i < glifos.length; i++) {
    const d = trazoDeGlifo(glifos[i], size);
    if (d.length > 2) {
      if (d.length > TOPE_D) throw new Error('Trazo demasiado largo: ' + d.length);
      paths.push(
        `<path transform="translate(${cursor.toFixed(2)} ${y.toFixed(2)})" fill="${color}" d="${d}"/>`
      );
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

// Ancho de una linea a cuerpo 1, para poder despejar el cuerpo que la hace
// entrar en el ancho util en vez de tantear numeros a mano.
function anchoUnitario(tramos, fuentes) {
  let total = 0;
  for (const t of tramos) {
    const f = fuentes[t.estilo];
    const glifos = [...t.texto].map((ch) => f.charToGlyph(ch));
    for (let i = 0; i < glifos.length; i++) {
      total += glifos[i].advanceWidth / f.unitsPerEm;
      if (i + 1 < glifos.length) {
        total += (f.getKerningValue(glifos[i], glifos[i + 1]) || 0) / f.unitsPerEm;
      }
    }
  }
  return total;
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

  // Se mide por la altura de MAYUSCULA y no por la caja de la fuente: la caja
  // trae aire arriba y abajo que desbalancea la composicion.
  const alturaMayuscula = (f, size) =>
    (((f.tables.os2 && f.tables.os2.sCapHeight) || f.unitsPerEm * 0.7) / f.unitsPerEm) * size;

  for (const p of PIEZAS) {
    const urlBase = H - MARGEN;
    const elementos = [];

    // Cuerpo de la frase. Con logotipo es fijo; sin logotipo se agranda hasta
    // llenar el ancho util, con un tope para que no quede desmedida.
    const anchoMayor = Math.max(...p.lineas.map((l) => anchoUnitario(l, fuentes)));
    const cuerpo = p.conLogo
      ? FRASE_CON_LOGO
      : Math.min(FRASE_SOLA_TOPE, ANCHO_UTIL / anchoMayor);

    const cap = alturaMayuscula(fuentes.serif, cuerpo);
    const interlinea = cuerpo * INTERLINEA;
    const altoBloque = cap + (p.lineas.length - 1) * interlinea;

    let primeraBase;
    if (p.conLogo) {
      const logoY = MARGEN;
      const reglaY = logoY + logoH + AIRE_LOGO_REGLA;
      elementos.push(
        `<g transform="translate(${MARGEN} ${logoY}) scale(${escalaLogo})">\n    ${interiorSvg(logoSvg)}\n  </g>`,
        `<rect x="${MARGEN}" y="${reglaY}" width="${REGLA_W}" height="${REGLA_H}" fill="${ACCENT}"/>`
      );
      primeraBase = reglaY + REGLA_H + AIRE_REGLA_FRASE + cap;
    } else {
      // Sin logotipo la frase es lo unico arriba: se centra opticamente en el
      // espacio que queda entre el margen superior y la URL.
      const desde = MARGEN;
      const hasta = urlBase - AIRE_SOBRE_URL;
      primeraBase = desde + (hasta - desde - altoBloque) / 2 + cap;
    }

    let anchoMax = 0;
    p.lineas.forEach((linea, i) => {
      const r = lineaACurvas(linea, fuentes, cuerpo, MARGEN, primeraBase + i * interlinea);
      anchoMax = Math.max(anchoMax, r.ancho);
      elementos.push(r.paths);
    });

    elementos.push(
      lineaACurvas([{ texto: p.url, estilo: 'sans', color: TAUPE }], fuentes, URL_TAM, MARGEN, urlBase).paths
    );

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BONE}"/>
      <stop offset="1" stop-color="${PARCHMENT}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fondo)"/>
  ${elementos.join('\n  ')}
</svg>
`;

    // Ultima red: si quedo cualquier NaN suelto, no se genera la imagen. Un
    // NaN no rompe el rasterizado, lo deforma en silencio.
    if (svg.includes('NaN')) throw new Error('El SVG de ' + p.archivo + ' contiene NaN');

    // Se rasteriza al doble y se baja a 1200: el sobremuestreo deja los bordes
    // de las curvas mas limpios que dibujar directo al tamano final.
    await sharp(Buffer.from(svg), { density: 288 })
      .resize(W * 2, H * 2)
      .resize(W, H, { kernel: 'lanczos3' })
      .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(p.archivo);

    const kb = (fs.statSync(p.archivo).size / 1024).toFixed(0);
    console.log(
      p.archivo.padEnd(42) + kb + ' kB  | cuerpo ' + Math.round(cuerpo) +
      ' px | linea mas ancha ' + Math.round(anchoMax) + ' de ' + ANCHO_UTIL
    );
    if (anchoMax > ANCHO_UTIL) console.log('   OJO: se pasa del margen seguro.');
  }
})();
