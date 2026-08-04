// Configuración de contacto centralizada.
// Editá estos valores en un solo lugar; los usan CTA.jsx y FloatingCTA.jsx.

// Número de WhatsApp en formato internacional, SOLO dígitos (sin "+", sin espacios).
// Ej: +54 11 5420010  ->  '54115420010'
export const WA_NUMBER = '541154200104';

// Mensajes prellenados de WhatsApp. Editá el texto acá según necesidad.
export const WA_MESSAGES = {
  // CTA principal de la página de pacientes.
  paciente:
    'Hola, quisiera recibir información sobre una primera consulta en Psiquiatrix.',

  // Botón flotante en la página de pacientes (mensaje más extenso).
  pacienteFlotante:
    'Hola, quisiera recibir información sobre una primera consulta en Psiquiatrix. Me gustaría saber si su atención se adapta a mi situación y cómo coordinar los próximos pasos.',

  // Botón flotante en la página de psicólogos/as.
  psico:
    'Hola, soy psicólogo/a y quería consultar sobre derivaciones a Psiquiatrix. Me gustaría conocer más sobre cómo trabajan y coordinar una primera conversación profesional.',
};

// Construye una URL de WhatsApp con mensaje prellenado.
export function waUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
