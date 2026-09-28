/**
 * Reenvía cada envío de formulario al Apps Script de la planilla.
 *
 * Netlify ejecuta esta función sola, por el nombre del archivo: el evento
 * `submission-created` se dispara con cada envío verificado (sin el spam que
 * filtra Netlify) de cualquiera de los tres formularios.
 *
 * Reemplaza a los webhooks de Netlify, que se deshabilitaban solos. Apps Script
 * contesta un POST con un 302 hacia otra dirección, donde está el resultado, y
 * el webhook lo contaba como fallo: reintentaba cuatro veces cada envío (el
 * script descartaba los repetidos, así que no se notaba) y al juntar fallos
 * Netlify deshabilitaba la notificación. Medido el 28/09/2026.
 *
 * Acá el 302 cuenta como éxito, porque llega DESPUÉS de que doPost terminó:
 * es la forma de Google de decir "listo, el resultado está en esta otra
 * dirección". No se sigue la redirección: es la parte lenta, y no hace falta.
 *
 * La URL del script no está en el repo: va en la variable de entorno
 * APPS_SCRIPT_URL de Netlify (Site configuration → Environment variables).
 * Cada vez que se redespliega el Apps Script como implementación NUEVA la URL
 * cambia, y hay que actualizarla ahí. Ver docs/contactos-google-sheets.md.
 */
export const handler = async (event) => {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    console.error('Falta la variable de entorno APPS_SCRIPT_URL: el envío no llegó a la planilla.');
    return { statusCode: 500 };
  }

  // Lo que manda el evento es { payload: <envío>, site: ... }. El envío tiene
  // la misma forma que el cuerpo del webhook de antes (form_name, created_at,
  // id, data), así que el Apps Script no cambia.
  let envio;
  try {
    envio = JSON.parse(event.body).payload;
  } catch (err) {
    console.error('El evento no trajo un envío legible:', err);
    return { statusCode: 400 };
  }

  const quien = `${envio.form_name} (${envio.id})`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envio),
      redirect: 'manual',
      // La función tiene 10 s en total. doPost tarda entre 1 y 5 s.
      signal: AbortSignal.timeout(9000),
    });

    if (res.status === 302 || res.ok) {
      console.log(`Enviado a la planilla: ${quien}`);
      return { statusCode: 200 };
    }

    console.error(`Apps Script contestó ${res.status} para ${quien}`);
    return { statusCode: 502 };
  } catch (err) {
    console.error(`No se pudo llegar al Apps Script para ${quien}:`, err);
    return { statusCode: 502 };
  }
};
