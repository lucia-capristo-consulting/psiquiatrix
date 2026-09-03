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
// LOS DATOS DE CONTACTO SON PERSONALES de cada una, no los del sitio: quien
// escanea la tarjeta espera escribirle A ELLA.
//
// Si se cambia un teléfono o un mail acá, hay que volver a correr
// `node scripts/generar-tarjetas.cjs`: el archivo que se guarda en la agenda
// se genera a partir de esto y si no queda desactualizado.
// ─────────────────────────────────────────────────────────────────────────────

export const TARJETAS = [
  {
    // La ruta: www.psiquiatrix.ar/amanda
    slug: 'amanda',
    bioId: 'amanda', // con qué entrada de bios-directoras.js se corresponde
    nombre: 'Amanda Villaverde',
    titulo: 'Médica psiquiatra',
    rol: 'Cofundadora y Directora Clínica de Psiquiatrix',
    matricula: 'M.N. 60.654',
    // Una línea, la que se lee de un vistazo antes de decidir si seguir leyendo.
    presentacion:
      'Médica Especialista en Psiquiatría y Psicología Médica con más de 35 años de experiencia clínica.',
    foto: '/tarjetas/amanda.jpg',
    qr: '/tarjetas/qr-amanda.svg',
    vcard: '/tarjetas/amanda-villaverde.vcf',
    contacto: {
      // Sólo dígitos y con el 9 de celular: es lo que necesita el link de
      // WhatsApp. Sin ese 9, wa.me no resuelve el número.
      whatsapp: '5491149479933',
      // Como se muestra y como se marca al tocar "llamar".
      telefono: '+54 11 4947-9933',
      mail: 'dra.mavillaverde@gmail.com',
    },
  },
];

export const tarjetaPorSlug = (slug) => TARJETAS.find((t) => t.slug === slug) || null;
