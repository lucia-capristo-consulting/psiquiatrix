// ─────────────────────────────────────────────────────────────────────────────
// TEXTOS QUE APARECEN DESPUÉS DE ENVIAR UN FORMULARIO
//
// Se editan acá y cambian en el sitio. No hay que tocar nada más.
//
//   exito  → cuando la consulta se envió bien.
//   error  → cuando algo falló y no se pudo enviar.
//
// En el formulario de PACIENTES el mail es opcional, así que el mensaje de
// éxito tiene dos versiones y el sitio elige sola la que corresponde:
//
//   conMail → la persona dejó una dirección, así que le va a llegar el correo.
//   sinMail → no dejó ninguna. No se le puede prometer un correo que no existe.
//
// Están escritas enteras, las dos, en vez de armarse por partes. Es más largo
// de leer pero se ve exactamente lo que va a leer la persona, y se puede
// cambiar una sin miedo a romper la otra.
//
// En el de PSICÓLOGOS el mail es obligatorio, así que hay un solo texto.
//
// OJO: acá se promete un plazo ("a la brevedad"). El mail automático promete
// lo mismo con otras palabras, y la persona lee los dos con minutos de
// diferencia. Si cambiás el plazo acá, cambialo también en la pestaña
// "plantillas-mail" del Google Sheet. Ver docs/auto-reply-formularios.md.
// ─────────────────────────────────────────────────────────────────────────────

export const MENSAJES_PACIENTES = {
  exito: {
    conMail:
      'Recibimos tu mensaje y te enviamos una confirmación por correo. Una profesional del equipo te va a contactar a la brevedad.',
    sinMail:
      'Recibimos tu mensaje. Una profesional del equipo te va a contactar a la brevedad.',
  },
  error: 'No pudimos enviar tu mensaje. Probá de nuevo o escribinos por WhatsApp.',
};

export const MENSAJES_PSICOLOGOS = {
  exito:
    'Recibimos tu mensaje y te enviamos una confirmación por correo. Te contactaremos a la brevedad.',
  error: 'No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.',
};

export const MENSAJES_SUMATE = {
  exito:
    'Recibimos tu postulación y te enviamos una confirmación por correo. Vamos a leerla y te escribimos.',
  error: 'No pudimos enviar tu postulación. Probá de nuevo en unos minutos.',
};

// Texto del botón según el estado del envío.
export const BOTON = {
  enviando: 'Enviando…',
  enviado: 'Enviado',
};
