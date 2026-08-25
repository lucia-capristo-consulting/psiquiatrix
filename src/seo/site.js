// Datos del sitio compartidos por todo el SEO: los consumen Seo.jsx, schema.js,
// pages.js y el script de prerender. Antes SITE_URL estaba duplicado en dos
// archivos; vive solo acá para que no se puedan desincronizar.

export const SITE_URL = 'https://www.psiquiatrix.ar';

export const SITE_NAME = 'PsiquiatriX';

export const OG_IMAGE = {
  url: `${SITE_URL}/og-psiquiatrix.jpg`,
  type: 'image/jpeg',
  width: 1731,
  height: 909,
  alt: 'PsiquiatriX — Centro de psiquiatría online: psiquiatría profesional con mirada humana.',
};

// Logotipo para el campo `logo` del JSON-LD. Se usa la versión con fondo
// transparente porque los consumidores de datos estructurados suelen mostrarlo
// sobre blanco. Los archivos de marca viven en `public/marca/`.
export const LOGO = {
  url: `${SITE_URL}/marca/logo-psiquiatrix-transparente.png`,
  width: 2400,
  height: 843,
};
