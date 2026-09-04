# Auto-reply de los formularios

Mail automático de confirmación para quien completa un formulario del sitio.
Antes, la persona veía el "gracias" en pantalla y no recibía nada: no le
quedaba comprobante de que la consulta había llegado.

Corre dentro del **mismo Apps Script** que ya vuelca los envíos al Google Sheet
(ver [contactos-google-sheets.md](contactos-google-sheets.md)). No hay servicio
nuevo, no hay backend y **el código del sitio no se toca**.

El script completo está en [`apps-script/Codigo.gs`](apps-script/Codigo.gs).

## Qué manda

Un mail por envío, distinto según el formulario (`contacto-pacientes` y
`contacto-psicologos`), con el logo, el texto de la plantilla, un aviso
destacado opcional y un pie.

Dos decisiones de fondo, que conviene no revertir sin pensarlas:

- **El mail NO repite lo que la persona escribió.** Esos mensajes pueden
  contener información de salud y el correo viaja hasta una casilla que no
  controlamos. Se confirma que el mensaje llegó, nada más.
- **El de pacientes lleva el aviso de urgencias.** Si alguien escribe en una
  crisis, esta confirmación automática puede ser lo único que lea en varias
  horas.

## Dónde vive el texto

En una pestaña del propio Sheet, llamada **`plantillas-mail`**. La crea el
script solo la primera vez que corre, ya cargada con los textos de arranque.

| Formulario | Asunto | Cuerpo del mail | Aviso destacado |
| --- | --- | --- | --- |
| `contacto-pacientes` | Recibimos tu consulta | Hola {{nombre}}: … | Si estás atravesando una urgencia… |
| `contacto-psicologos` | Recibimos tu consulta | Hola {{nombre}}: … | *(vacío)* |

Reglas para editarlo:

- **No cambies la columna `Formulario`**: es la que vincula cada texto con su
  formulario. El resto se edita libremente.
- **Los párrafos se separan con un renglón en blanco** dentro de la celda
  (`Alt+Enter` dos veces). Cada bloque sale como un párrafo del mail; el
  espaciado lo pone el diseño.
- **`{{nombre}}`** se reemplaza por el primer nombre de quien escribió. Si el
  campo viene vacío, "Hola {{nombre}}:" queda como "Hola:", sin espacio suelto.
- **Si dejás vacío el aviso destacado**, ese bloque no aparece.
- Si borrás una fila entera o vaciás el asunto o el cuerpo, el script cae en los
  textos de respaldo que están escritos en `Codigo.gs`. No se queda sin mandar.

**Por qué en el Sheet y no en el código**: el script está publicado como
aplicación web, y **cada cambio en el código exige crear una nueva versión de
la implementación** para que tenga efecto. Con el texto en una pestaña, cambiar
una palabra es escribir en una celda: el envío siguiente ya sale con el texto
nuevo, sin desplegar nada. Como el texto se va a iterar y el código no, conviene
que estén separados.

## Texto plano o HTML

Manda **las dos versiones en el mismo mail**. El cliente de correo elige: los
que muestran HTML ven el diseño, y los que no —o quien lee desde un reloj, o un
lector de pantalla— reciben el texto limpio. Es lo mismo que hace cualquier
mail de una empresa.

Sobre el diseño, tres límites propios del correo que conviene conocer:

- **Las tipografías de la marca no se pueden usar.** Instrument Serif e Inter
  Tight se sirven desde el sitio, y los clientes de correo no cargan fuentes
  externas. El mail usa Georgia y Arial, que existen en todos lados y guardan
  un aire parecido.
- **Sí puede llevar imágenes**, y lleva el logo, tomado de
  `www.psiquiatrix.ar/marca/logo-psiquiatrix-transparente.png`. Pero muchos
  clientes las bloquean hasta que la persona toca "mostrar imágenes", así que
  **el mail está armado para leerse igual de bien sin ninguna imagen**. Nada
  importante vive dentro de una foto.
- **No hay hojas de estilo ni CSS moderno**: todo va en tablas y estilos en
  línea. Es feo de escribir y es la única forma que funciona parejo en Gmail,
  Outlook y iPhone.

Los colores son los de la marca: fondo `#F2EDE4`, texto `#3C3833`, la barra del
aviso en terracota `#B8541F`.

## La dirección del remitente

El mail tiene que salir de **psiquiatrix.online@gmail.com**.

Acá hay un detalle que hay que verificar, porque Apps Script **manda siempre
desde la cuenta dueña del script**. O sea, desde la cuenta de Google en la que
vive el Sheet. Hay dos formas de que salga de la dirección correcta:

1. **Que el Sheet viva en esa cuenta.** Es lo más simple: si el Sheet lo creó
   `psiquiatrix.online@gmail.com`, no hay nada que configurar.
2. **Que esa dirección esté cargada como alias verificado** en la cuenta dueña:
   Gmail → Configuración → Cuentas → *Enviar mensaje como* → agregar y verificar
   la dirección. El script la detecta sola y la usa.

Si no se cumple ninguna de las dos, el mail sale igual, pero **desde la cuenta
dueña del Sheet**. Para saber qué está pasando, corré `probarAutoReply()` (más
abajo): deja escrito en el registro desde qué dirección salió.

En todos los casos el `Responder a` apunta a `psiquiatrix.online@gmail.com`, así
que las respuestas llegan al lugar correcto aunque el remitente esté mal.

## Puesta en marcha

Partiendo del script que ya está andando:

1. **Pegá el código nuevo.** Sheet → Extensiones → Apps Script, reemplazá todo
   por el contenido de [`apps-script/Codigo.gs`](apps-script/Codigo.gs) y guardá.

2. **Autorizá los permisos de Gmail.** Este paso es el que se olvida y hace que
   el auto-reply falle en silencio: el script viejo no mandaba mails, así que la
   autorización que ya diste **no incluye** el permiso para enviarlos.

   En el editor, elegí la función `probarAutoReply` y tocá **Ejecutar**. Google
   va a pedir permisos de nuevo: aceptalos. Vas a recibir los dos mails de
   prueba en tu propia casilla.

3. **Mirá los dos mails.** Es el momento de ver cómo se ve el diseño antes de
   que lo reciba alguien de verdad.

4. **Creá una nueva versión de la implementación**: Implementar → Administrar
   implementaciones → editar (el lápiz) → *Versión: Nueva* → Implementar. **La
   URL `/exec` no cambia**, así que no hay que tocar nada en Netlify.

   Sin este paso, el webhook sigue ejecutando el código viejo y no manda nada.

5. **Probá de punta a punta**: completá cada formulario en el sitio publicado,
   con una dirección tuya, y confirmá que llegan el mail y la fila del Sheet.

## El aviso al equipo

Además del mail a la persona, el script manda uno **al equipo** avisando que
entró una consulta.

Netlify ya manda un aviso propio, pero con **asunto fijo**: Gmail agrupa todos
los avisos en una sola conversación y hay que abrirla para ver cuál es cuál.
Ese asunto **no se puede configurar desde Netlify** — no hay ninguna plantilla
que tocar. Por eso el aviso se manda desde el script, donde lo escribimos
nosotros.

El asunto queda así:

    [Pacientes] Nueva consulta de Juan Pérez — 03/09 14:32
    [Psicólogos] Nueva consulta de Ana Ruiz — 03/09 15:10

Tres decisiones detrás de ese formato:

- **El nombre** es lo que permite reconocer la consulta sin abrirla.
- **La hora** garantiza que dos consultas nunca compartan asunto. Es lo que
  dispara el agrupado de Gmail: si la misma persona escribe dos veces, sin la
  hora los dos mails volverían a apilarse.
- **La audiencia entre corchetes** se lee de un vistazo y sirve para filtrar en
  Gmail.

El **"Responder a" apunta a quien escribió**, así que desde el aviso se le
contesta directamente, sin copiar la dirección a mano.

A quién le llega se configura en `NOTIFICAR_A`, arriba del script. Acepta
varias direcciones. Si se deja vacío, no se manda ningún aviso.

### Qué hacer con la notificación de Netlify

Conviene **dejarla prendida unas semanas** y recién después apagarla, por una
razón concreta: el aviso del script viaja por el webhook, así que si el webhook
se cae —ya pasó una vez— dejás de enterarte de las consultas. El de Netlify es
independiente y llega igual.

Mientras convivan, si molesta verlos duplicados, se puede armar un filtro en
Gmail que archive los de Netlify bajo una etiqueta: quedan como respaldo sin
ocupar la bandeja.

Para apagarla: Netlify → Forms → Settings & usage → Form notifications →
Options → Delete, en las dos notificaciones por mail.

## Postulaciones: planilla aparte y CV en el Drive

El formulario de `/sumate` no se comporta como los otros dos, por dos razones que valen para cualquier formulario que reciba archivos.

**Va a su propia planilla.** No es prolijidad: es para poder compartir la de contactos con el equipo sin dar acceso a las postulaciones, y al revés. La planilla se llama *PsiquiatriX — Postulaciones* y **se crea sola** la primera vez que entra una; su id queda guardado en las propiedades del script, así que no hay nada que configurar a mano.

**El CV no se queda en Netlify.** Netlify guarda el archivo en una URL larga y difícil de adivinar, pero **sin contraseña**: quien tenga el link entra. Un CV trae teléfono, a veces domicilio, y la trayectoria laboral completa de una persona. El script lo baja y lo copia a una carpeta del Drive llamada *PsiquiatriX — CV de postulaciones*, y en la planilla queda el link de Drive. Ahí el archivo tiene los permisos que ustedes le pongan.

Los archivos se guardan como `Nombre Apellido — CV.pdf`. Sin eso quedan todos con el nombre que puso cada persona, y buscar entre treinta `cv.pdf` no sirve de nada.

**Si la copia al Drive falla** —se cayó la red, cambió la URL— la celda queda con el link original de Netlify y la aclaración de que no se pudo copiar. Es preferible tener el CV en un lugar menos ideal que perderlo.

Para ver dónde quedaron la planilla y la carpeta, correr **`verDondeGuarda()`** desde el editor: deja los dos links en el registro de ejecución.

### Permisos nuevos

Guardar en Drive y descargar el archivo son permisos que el script **todavía no tiene**. Al pegar esta versión hay que volver a autorizarlo: elegir `verDondeGuarda` en el editor, tocar Ejecutar y aceptar. Sin eso, las postulaciones entran pero el CV no se copia.

## Registro de envíos

El script anota cada intento en la pestaña **`log-autoreply`**: fecha,
formulario, destinatario, si salió o no, y el detalle. Aparecen los dos mails:
el aviso al equipo va marcado como `(aviso al equipo)`. Es el primer lugar donde
mirar si alguien dice que no le llegó nada.

Un envío que falla **nunca** frena el registro del contacto: la fila se guarda
primero y el mail va después. Si el mail falla, el contacto está igual.

## Límites de envío

Una cuenta de Gmail común permite **100 destinatarios por día** desde Apps
Script (una cuenta de Google Workspace, 1.500). Con el volumen actual sobra de
lejos, pero el script chequea la cuota antes de mandar y, si está agotada,
registra "no enviado" en el log en vez de romper.

## Si algo no anda

| Síntoma | Causa más probable |
| --- | --- |
| No llega ningún mail | Falta el paso 4: la implementación sigue en la versión vieja. |
| No llega y el log dice "no enviado" | Mirá la columna Detalle: casi siempre es cuota agotada o dirección inválida. |
| No llega y el log está vacío | El webhook no llegó. Es un problema del Sheet, no del mail: revisá la otra guía. |
| Llega desde otra dirección | El alias no está cargado. Ver *La dirección del remitente*. |
| Llega dos veces | El dedup por `id` no está funcionando: revisá que la columna ID exista en la pestaña del formulario. |
| Cae en spam | Falta reputación de la dirección. Es esperable al principio; se corrige solo con el uso. |

## Pendiente

El texto de arranque es provisorio: dice que se responde "dentro de las próximas
horas hábiles". **Falta definir la promesa real** —si se aclara un horario de
atención, si se da un plazo concreto— y escribir la versión definitiva de los
dos mails. Se cambia en la pestaña `plantillas-mail`, sin tocar código.

También queda pendiente que la política de privacidad mencione este correo: es
un uso más de los datos de la persona.
