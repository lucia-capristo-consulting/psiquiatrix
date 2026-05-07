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
