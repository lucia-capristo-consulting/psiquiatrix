// Estilo compartido de los campos de los dos formularios de contacto.
//
// Antes cada formulario tenía su copia de este string, y los campos usaban la
// serif en itálica a 20px. Se ve linda en un titular y es incómoda para
// escribir adentro: la itálica cansa a la lectura corrida y una serif de
// display no está pensada para texto que se teclea. Ahora usan la misma sans
// que el cuerpo del sitio.
//
// 17px es un punto más que el texto largo de la página (16px). Además conviene
// no bajar de 16: Safari en iPhone hace zoom automático al enfocar un campo
// con letra más chica, y la página queda desencuadrada.
export const inputCls =
  'bg-transparent border-0 border-b border-graphite/70 py-2 font-sans text-[17px] text-graphite placeholder:opacity-40 focus:outline-none focus:border-accent transition-colors';
