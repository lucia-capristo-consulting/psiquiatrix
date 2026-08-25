import { medicalClinicSchema, psicologosServiceSchema } from './schema.js';

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
  },
];

export function pageByPath(path) {
  const page = PAGES.find((p) => p.path === path);
  if (!page) throw new Error(`[seo] No hay metadata declarada para la ruta "${path}"`);
  return page;
}
