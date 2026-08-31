// Analítica: envoltura mínima sobre Umami.
//
// El <script> de Umami se carga en index.html. Este archivo existe por dos
// razones, y las dos importan:
//
// 1. Umami puede no estar. Un bloqueador de publicidad corta el script, o falla
//    la red. Sin esta guarda, un `window.umami.track(...)` llamado dentro del
//    try/catch de un formulario haría que un envío EXITOSO se le mostrara como
//    fallido al visitante. Medir nunca puede romper el sitio.
//
// 2. Los eventos van SIN propiedades, a propósito. Los formularios reciben
//    nombre, teléfono, mail y un mensaje libre donde alguien puede escribir
//    información sobre su salud: nada de eso sale del sitio. Acá se registra
//    únicamente que la conversión ocurrió, nunca quién ni con qué datos.
//    De paso, en el plan Hobby cada propiedad guardada consume un evento del
//    cupo mensual; sin propiedades, una conversión cuesta uno solo.
//
// Los clics en links se marcan directo en el HTML con `data-umami-event`, que
// no necesita JavaScript. Esta función es para lo que no es un clic: por ahora,
// los formularios enviados con éxito.
export function trackEvent(name) {
  try {
    window.umami?.track(name);
  } catch {
    // Deliberadamente en silencio: la medición es información de más, nunca
    // parte del flujo que el visitante está siguiendo.
  }
}
