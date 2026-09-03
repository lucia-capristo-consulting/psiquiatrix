// Datos del sitio compartidos por todo el SEO: los consumen Seo.jsx, schema.js,
// pages.js y el script de prerender. Antes SITE_URL estaba duplicado en dos
// archivos; vive solo acá para que no se puedan desincronizar.

export const SITE_URL = 'https://www.psiquiatrix.ar';

export const SITE_NAME = 'PsiquiatriX';

// Arma una imagen de Open Graph (la que se ve al compartir un link en
// WhatsApp, Facebook, LinkedIn o Telegram).
//
// Las dimensiones se declaran a mano y TIENEN QUE COINCIDIR con las del
// archivo: los scrapers les creen sin verificarlas, y si no coinciden algunos
// recortan mal la tarjeta. Si reemplazás una imagen por otra de distinto
// tamaño, actualizá los números acá.
//
// El tamaño recomendado es 1200×630. La de la home es más grande por razones
// históricas; mantiene la proporción, así que funciona igual.
export function imagenOg({ archivo, width, height, alt, type = 'image/jpeg' }) {
  return { url: `${SITE_URL}/${archivo}`, type, width, height, alt };
}

export const OG_IMAGE = imagenOg({
  archivo: 'og-psiquiatrix.jpg',
  width: 1731,
  height: 909,
  alt: 'PsiquiatriX — Centro de psiquiatría online: psiquiatría profesional con mirada humana.',
});

// Logotipo para el campo `logo` del JSON-LD. Se usa la versión con fondo
// transparente porque los consumidores de datos estructurados suelen mostrarlo
// sobre blanco. Los archivos de marca viven en `public/marca/`.
export const LOGO = {
  url: `${SITE_URL}/marca/logo-psiquiatrix-transparente.png`,
  width: 2400,
  height: 843,
};
