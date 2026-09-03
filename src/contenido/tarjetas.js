// ─────────────────────────────────────────────────────────────────────────────
// TARJETAS DIGITALES DE LAS DIRECTORAS
//
// Cada una tiene su propia página (por ejemplo /amanda) a la que se llega
// escaneando el QR que ella muestra en el celular. Desde ahí se la puede
// contactar, guardar su contacto en la agenda y leer su trayectoria.
//
// La BIO no se escribe acá: sale de bios-directoras.js, para que no haya dos
// versiones del mismo texto conviviendo. Acá va sólo lo propio de la tarjeta.
//
// OJO CON LOS DATOS DE CONTACTO: hoy son los INSTITUCIONALES, los mismos del
// resto del sitio. No tengo un teléfono ni un mail personal de cada una. Si
// quieren usar los suyos, se reemplazan acá y cambia en la página, en el botón
// de guardar contacto y en el archivo de agenda que se descarga.
// ─────────────────────────────────────────────────────────────────────────────

import { WA_NUMBER } from './contacto-whatsapp.js';

const MAIL_INSTITUCIONAL = 'psiquiatrix.online@gmail.com';

export const TARJETAS = [
  {
    // La ruta: www.psiquiatrix.ar/amanda
    slug: 'amanda',
    bioId: 'amanda', // con qué entrada de bios-directoras.js se corresponde
    nombre: 'Amanda Villaverde',
    titulo: 'Médica psiquiatra',
    rol: 'Cofundadora y Directora Clínica de PsiquiatriX',
    matricula: 'M.N. 60.654',
    // Una línea, la que se lee de un vistazo antes de decidir si seguir leyendo.
    presentacion:
      'Médica Especialista en Psiquiatría y Psicología Médica con más de 35 años de experiencia clínica.',
    // Resumen de la sección "Sobre Amanda", más corto que la bio completa.
    sobre:
      'Una mirada clínica integral, construida a lo largo de más de 35 años de práctica en instituciones hospitalarias, docencia universitaria y consultorio privado.',
    foto: '/tarjetas/amanda.jpg',
    qr: '/tarjetas/qr-amanda.svg',
    vcard: '/tarjetas/amanda-villaverde.vcf',
    contacto: {
      whatsapp: WA_NUMBER,
      telefono: '+54 9 11 5420-0104',
      mail: MAIL_INSTITUCIONAL,
    },
  },
];

export const tarjetaPorSlug = (slug) => TARJETAS.find((t) => t.slug === slug) || null;
