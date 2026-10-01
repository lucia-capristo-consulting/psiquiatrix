// Genera las versiones en negativo del logotipo, a partir del SVG sin fondo.
//
// NO corre en el build: se ejecuta a mano si cambia el logotipo. Usa sharp,
// que se instala igual que para generar-qr.cjs:
//   npm install --no-save sharp
//   node scripts/generar-logo-negativo.cjs
//
// El negativo va todo en Hueso, también la x. Sobre fondo Terracota la x en
// Terracota desaparecería, y en Grafito no llega al contraste mínimo: queda
// distinguida sólo por la itálica, igual que en el isotipo (la x sola en Hueso
// sobre Terracota). Hueso sobre Terracota da un contraste de 4,2:1.
//
// Salen dos piezas, cada una en SVG y PNG, en public/marca/:
//   logo-psiquiatrix-negativo               sobre fondo Terracota
//   logo-psiquiatrix-negativo-transparente  sin fondo, para fondos oscuros
// Las medidas y el margen son los del logotipo original (1736 × 610, PNG a
// 2400 px de ancho), así que se pueden reemplazar uno por otro sin reacomodar.

const sharp = require(process.cwd() + '/node_modules/sharp');
const fs = require('fs');

const ORIGEN = 'public/marca/logo-psiquiatrix-transparente.svg';
const HUESO = '#F2EDE4';
const TERRACOTA = '#B8541F';
const ANCHO_PNG = 2400;

const original = fs.readFileSync(ORIGEN, 'utf8');
const colores = original.match(/fill="#[0-9A-Fa-f]{6}"/g) || [];
if (colores.length !== 2) {
  throw new Error(`Esperaba 2 colores en ${ORIGEN} (palabra y x) y encontré ${colores.length}. ¿Cambió el archivo?`);
}

const enHueso = original.replace(/fill="#[0-9A-Fa-f]{6}"/g, `fill="${HUESO}"`);
const viewBox = original.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
const [w, h] = [viewBox[1], viewBox[2]];

const piezas = {
  'logo-psiquiatrix-negativo': enHueso.replace(
    /(<svg[^>]*>\s*(?:<title>[^<]*<\/title>\s*)?)/,
    `$1<rect width="${w}" height="${h}" fill="${TERRACOTA}"/>\n  `
  ),
  'logo-psiquiatrix-negativo-transparente': enHueso,
};

(async () => {
  for (const [nombre, svg] of Object.entries(piezas)) {
    const base = 'public/marca/' + nombre;
    fs.writeFileSync(base + '.svg', svg);
    await sharp(Buffer.from(svg), { density: 300 })
      .resize({ width: ANCHO_PNG })
      .png()
      .toFile(base + '.png');

    // Comprobar lo que salió, no suponerlo: medidas y colores del PNG.
    const { data, info } = await sharp(base + '.png').raw().toBuffer({ resolveWithObject: true });
    const px = (x, y) => {
      const i = (y * info.width + x) * info.channels;
      return [data[i], data[i + 1], data[i + 2], info.channels === 4 ? data[i + 3] : 255];
    };
    const esquina = px(5, 5);
    console.log(`${nombre}: ${info.width} × ${info.height}, esquina rgba(${esquina.join(',')})`);
  }
})();
