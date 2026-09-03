// Validación de mail del lado del navegador.
//
// Dos cosas distintas, que conviene no confundir:
//
//   1. FORMATO — que sea una dirección bien escrita. Esto SÍ se puede validar
//      acá y bloquea el envío. `type="email"` solo ya exige la arroba, pero es
//      más flojo de lo que parece: acepta "juan@gmail" sin dominio. El patrón
//      de abajo además exige un punto y una terminación de al menos 2 letras.
//
//   2. QUE LA CASILLA EXISTA — eso NO se puede hacer desde el navegador sin
//      mandarle la dirección de la persona a un servicio de terceros, cosa que
//      en una práctica médica no queremos. Y aunque se hiciera, no resolvería
//      el error real: nadie escribe mal "gmail.com" de una forma que un chequeo
//      de dominio detecte, escribe "gmail.con".
//
// Por eso lo segundo se resuelve distinto: detectando dominios mal tipeados
// contra una lista de los más usados, y SUGIRIENDO la corrección. No bloquea:
// si alguien tiene un dominio propio parecido a uno de la lista, puede ignorar
// la sugerencia.

export const FORMATO_MAIL = '[^@\\s]+@[^@\\s]+\\.[a-zA-Z]{2,}';

export function formatoValido(mail) {
  return new RegExp('^' + FORMATO_MAIL + '$').test(String(mail || '').trim());
}

// Dominios frecuentes en Argentina. Sumar acá si aparece alguno seguido.
//
// La lista cumple DOS funciones, y por eso conviene que sea generosa: contra
// ella se buscan los errores de tipeo, pero además un dominio que figura acá
// nunca genera sugerencia. Faltar en la lista es lo que produce falsos
// positivos: "mail.com" existe de verdad y está a un solo caracter de
// "gmail.com", así que sin estar listado se le sugeriría corregirlo a quien
// lo usa bien.
const DOMINIOS = [
  'gmail.com',
  'googlemail.com',
  'mail.com',
  'msn.com',
  'ymail.com',
  'gmx.com',
  'zoho.com',
  'yandex.com',
  'hotmail.com',
  'hotmail.com.ar',
  'hotmail.es',
  'outlook.com',
  'outlook.com.ar',
  'outlook.es',
  'live.com',
  'live.com.ar',
  'yahoo.com',
  'yahoo.com.ar',
  'yahoo.es',
  'icloud.com',
  'me.com',
  'protonmail.com',
  'proton.me',
  'aol.com',
  'fibertel.com.ar',
  'speedy.com.ar',
  'arnet.com.ar',
  'ciudad.com.ar',
  'uolsinectis.com.ar',
];

// Cuántos errores de tipeo separan una palabra de la otra: cambiar una letra,
// agregarla, borrarla o INTERCAMBIAR dos contiguas.
//
// Ese último caso es el que obliga a usar Damerau-Levenshtein y no la
// Levenshtein clásica. "gmial.com" es el error más frecuente que existe, y
// para la clásica está a distancia 2 de "gmail.com" (dos sustituciones), o
// sea que quedaba fuera del umbral y no se sugería nada. Contando la
// transposición como UN error, que es lo que realmente fue, entra.
function distancia(a, b) {
  if (a === b) return 0;
  const n = a.length;
  const m = b.length;
  if (!n) return m;
  if (!m) return n;

  let dosAtras = null;
  let previa = new Array(m + 1);
  for (let j = 0; j <= m; j++) previa[j] = j;

  for (let i = 1; i <= n; i++) {
    const actual = new Array(m + 1);
    actual[0] = i;
    for (let j = 1; j <= m; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      actual[j] = Math.min(actual[j - 1] + 1, previa[j] + 1, previa[j - 1] + costo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        actual[j] = Math.min(actual[j], dosAtras[j - 2] + 1);
      }
    }
    dosAtras = previa;
    previa = actual;
  }
  return previa[m];
}

/**
 * Devuelve la dirección corregida si el dominio parece un error de tipeo,
 * o null si está bien escrito (o si no se parece lo suficiente a ninguno
 * conocido como para arriesgar una sugerencia).
 */
export function sugerirDominio(mail) {
  const limpio = String(mail || '').trim().toLowerCase();
  const arroba = limpio.lastIndexOf('@');
  if (arroba < 1) return null;

  const usuario = limpio.slice(0, arroba);
  const dominio = limpio.slice(arroba + 1);
  if (!dominio || DOMINIOS.indexOf(dominio) !== -1) return null;

  let mejor = null;
  let mejorDistancia = Infinity;
  for (const d of DOMINIOS) {
    const dist = distancia(dominio, d);
    if (dist < mejorDistancia) {
      mejorDistancia = dist;
      mejor = d;
    }
  }

  // En dominios cortos una sola letra de diferencia ya puede ser otro dominio
  // legítimo, así que ahí se es más estricto.
  const umbral = mejor && mejor.length <= 10 ? 1 : 2;
  if (mejorDistancia > 0 && mejorDistancia <= umbral) return usuario + '@' + mejor;
  return null;
}
