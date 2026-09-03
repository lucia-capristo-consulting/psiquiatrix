import { medicalClinicSchema, psicologosServiceSchema } from './schema.js';
import { OG_IMAGE, imagenOg } from './site.js';

// Fuente unica de verdad del SEO por ruta. La consumen dos cosas:
//   1. Los componentes de pagina, via <Seo {...pageByPath('/...')} />
//   2. scripts/prerender-meta.mjs, que genera un HTML estatico por ruta con
//      estos mismos tags ya escritos en el <head>.
//
// El punto 2 existe porque los scrapers de preview (WhatsApp, Facebook,
// LinkedIn, Telegram) NO ejecutan JavaScript: leen el HTML crudo y se van.
// Sin prerender se llevarian siempre los tags de la home. Google si ejecuta
// JavaScript, asi que para el buscador alcanzaba con <Seo />.
//
// Si agregas una pagina: sumala aca y agregale su regla en public/_redirects.
//
// IMAGEN DE PREVIEW POR RUTA: cada pagina puede traer su propia `ogImage`. Si
// no declara ninguna, usa la de la home. Para darle una propia a /psicologos:
//
//   1. Dejar el archivo en public/ (por ejemplo og-psiquiatrix-psicologos.jpg)
//   2. Descomentar el bloque `ogImage` de mas abajo y poner las medidas REALES
//      del archivo.
//
// No hace falta tocar nada mas: el componente <Seo /> y el prerender la toman
// de aca. El prerender es el que importa para WhatsApp, que no ejecuta
// JavaScript y lee el HTML tal como sale del servidor.

export const PAGES = [
  {
    path: '/',
    file: 'index.html',
    title: 'PsiquiatriX | Psiquiatría online en Argentina con mirada humana',
    description:
      'Atención psiquiátrica online para adultos en Argentina. Criterio clínico, mirada humana y seguimiento real. Solicitá contacto con PsiquiatriX.',
    jsonLd: medicalClinicSchema,
  },
  {
    path: '/psicologos',
    file: 'psicologos.html',
    title: 'Derivaciones psiquiátricas para psicólogos | PsiquiatriX',
    description:
      'PsiquiatriX trabaja con psicólogos derivadores con comunicación profesional, continuidad terapéutica y criterio clínico compartido. Conocé cómo derivar.',
    jsonLd: psicologosServiceSchema,
    ogImage: imagenOg({
      archivo: 'og-psiquiatrix-psicologos.jpg',
      width: 1200,
      height: 630,
      alt: 'PsiquiatriX — Cuando derivás a Psiquiatrix, seguís en la conversación.',
    }),
  },
];

export function pageByPath(path) {
  const page = PAGES.find((p) => p.path === path);
  if (!page) throw new Error(`[seo] No hay metadata declarada para la ruta "${path}"`);
  return page;
}
