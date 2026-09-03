# Textos y datos editables

Todo lo que se cambia sin tocar el diseño vive en esta carpeta. Editás el
archivo, guardás, y con eso alcanza: ningún componente tiene textos escritos
adentro.

| Archivo | Qué controla |
| --- | --- |
| `bios-directoras.js` | Las bios de Claudia y Amanda: resumen visible, detalle detrás de "Ver más", nombre, matrícula y fotos. Alimenta las **dos** páginas a la vez. |
| `contacto-whatsapp.js` | El número de WhatsApp y los mensajes que aparecen ya escritos al abrir el chat. |
| `mensajes-formulario.js` | Lo que se lee **después de enviar** un formulario: confirmación y error, en las dos audiencias. |
| `codigos-telefono.js` | La lista de países del campo de teléfono y cuáles aparecen arriba de todo. |

Cada archivo arranca con sus propias instrucciones. La regla general: se cambia
el texto **entre comillas**, sin borrar las comillas ni las comas.

## Lo que NO está acá

Dos cosas que también son texto editable pero viven en otro lado, por razones
que no se pueden evitar:

- **Los títulos y descripciones que salen en Google y en el preview de
  WhatsApp** están en `src/seo/pages.js`. No se pueden mover acá porque el
  script que arma esos datos durante la publicación los lee de ahí.

- **El texto de los mails automáticos** no está en el repo: vive en la pestaña
  `plantillas-mail` del Google Sheet de contactos. Está puesto ahí a propósito,
  para poder corregirlo sin volver a publicar nada. Ver
  `docs/auto-reply-formularios.md`.

## Ojo con esto

`mensajes-formulario.js` promete un plazo ("a la brevedad") y el mail
automático promete lo mismo con otras palabras. La persona lee los dos con
minutos de diferencia, así que **si cambiás el plazo en uno, cambialo en el
otro**.
