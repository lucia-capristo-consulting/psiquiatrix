// Netlify Forms helper for SPAs.
// Posts a form-encoded payload to the static page so Netlify's form handler can intercept it.
// Use along with a static stub form in index.html (so the build-time bot detects fields)
// and `data-netlify="true"` + a hidden `form-name` input on the React form.

export const encodeForm = (data) =>
  new URLSearchParams(data).toString();

export async function submitNetlifyForm(formName, data) {
  const payload = { 'form-name': formName, ...data };
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeForm(payload),
  });
  if (!res.ok) throw new Error(`Netlify form submission failed: ${res.status}`);
  return true;
}

/**
 * Envío con archivos adjuntos.
 *
 * El envío de arriba serializa los campos como texto, y así un archivo no
 * viaja: llega el nombre, no el contenido. Para adjuntar hay que mandar el
 * FormData tal cual, en multipart.
 *
 * Y hay un detalle que se paga caro si se pasa por alto: NO se declara el
 * Content-Type. El navegador lo arma solo, e incluye el separador aleatorio
 * que marca dónde empieza y termina cada parte. Si se escribe a mano, ese
 * separador falta y el servidor no puede leer nada.
 */
export async function submitNetlifyFormConArchivos(formName, formElement) {
  const payload = new FormData(formElement);
  payload.set('form-name', formName);
  const res = await fetch('/', { method: 'POST', body: payload });
  if (!res.ok) throw new Error(`Netlify form submission failed: ${res.status}`);
  return true;
}
