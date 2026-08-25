// Configuración de contacto centralizada.
// Editá estos valores en un solo lugar; los usan CTA.jsx y FloatingCTA.jsx.

// Número de WhatsApp en formato internacional, SOLO dígitos (sin "+", sin espacios).
//
// El 9 después del 54 NO es opcional: es el prefijo de celular argentino y es lo
// que hace que el link funcione tanto desde Argentina como desde el exterior.
// Sin ese 9, wa.me no resuelve el número y el botón no abre el chat.
//
// +54 9 11 5420-0104  ->  '5491154200104'
export const WA_NUMBER = '5491154200104';

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
