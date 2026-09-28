# Auto-reply de los formularios

Mail automático de confirmación para quien completa un formulario del sitio.
Antes, la persona veía el "gracias" en pantalla y no recibía nada: no le
quedaba comprobante de que la consulta había llegado.

Corre dentro del **mismo Apps Script** que ya vuelca los envíos al Google Sheet
(ver [contactos-google-sheets.md](contactos-google-sheets.md)). No hay servicio
nuevo ni backend: cambiar los mails no requiere tocar el sitio.

El script completo está en [`apps-script/Codigo.gs`](apps-script/Codigo.gs).

## Qué manda

Un mail por envío, distinto según el formulario (`contacto-pacientes`,
`contacto-psicologos` y `contacto-sumate`), con el logo, el texto de la
plantilla, un aviso destacado opcional y un pie.

**No sale al instante.** El script guarda la fila apenas llega el envío, pero
los mails los manda una corrida en segundo plano que Google ejecuta uno o dos
minutos después (ver [contactos-google-sheets.md](contactos-google-sheets.md)).
La persona ya vio en pantalla que su mensaje se envió; lo que se demora es la
confirmación por mail.

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
| `contacto-pacientes` | {{nombre}}, recibimos tu consulta | Hola {{nombre}}: … | Si estás atravesando una urgencia… |
| `contacto-psicologos` | {{nombre}}, recibimos tu consulta profesional | Hola {{nombre}}: … | *(vacío)* |
| `contacto-sumate` | {{nombre}}, recibimos tu postulación | Hola {{nombre}}: … | *(vacío)* |

Son los textos de arranque de `Codigo.gs`. Los que valen son los de la pestaña:
si alguien los editó ahí, pueden ser distintos.

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
dueña del Sheet**. Para saber qué está pasando, mirá la columna **Detalle** de
la pestaña `log-autoreply`: dice "enviado con alias …" o "enviado como la
cuenta dueña".

En todos los casos el `Responder a` apunta a `psiquiatrix.online@gmail.com`, así
que las respuestas llegan al lugar correcto aunque el remitente esté mal.

## Puesta en marcha

Partiendo del script que ya está andando:

1. **Pegá el código nuevo.** Sheet → Extensiones → Apps Script, reemplazá todo
   por el contenido de [`apps-script/Codigo.gs`](apps-script/Codigo.gs) y guardá.

2. **Autorizá los permisos.** Este paso es el que se olvida y hace que todo
   falle en silencio: si el código nuevo usa algo que el viejo no usaba (mandar
   mails, guardar en el Drive, bajar archivos, crear disparadores), la
   autorización que ya diste **no lo incluye**.

   En el editor, elegí la función `procesarPendientes` y tocá **Ejecutar**.
   Google pide todos los permisos que el script necesita: aceptalos. Es segura
   de correr a mano: sólo procesa las filas que estén en `PENDIENTE`, y si no
   hay ninguna no hace nada.

3. **Creá una nueva versión de la implementación**: Implementar → Administrar
   implementaciones → editar (el lápiz) → *Versión: Nueva* → Implementar. **La
   URL `/exec` no cambia**, así que no hay que tocar nada en Netlify.

   Sin este paso, la función de Netlify sigue llamando al código viejo y no
   manda nada.

4. **Probá de punta a punta**: completá cada formulario en el sitio publicado,
   con una dirección tuya, y confirmá que llegan la fila del Sheet y, uno o dos
   minutos después, el mail. Usá un texto normal: un tecleo al azar lo manda
   el filtro de Netlify a spam y ahí no se procesa.

## El aviso al equipo

Además del mail a la persona, el script manda uno **al equipo** avisando que
entró una consulta.

Netlify ya manda un aviso propio, pero con **asunto fijo**: Gmail agrupa todos
los avisos en una sola conversación y hay que abrirla para ver cuál es cuál.
Ese asunto **no se puede configurar desde Netlify** — no hay ninguna plantilla
que tocar. Por eso el aviso se manda desde el script, donde lo escribimos
nosotros.

El asunto queda así:

    [Pacientes] Nuevo mensaje de Juan Pérez
    [Psicólogos] Nuevo mensaje de Ana Ruiz
    [Postulaciones] Nuevo mensaje de Laura Gómez

- **El nombre** es lo que permite reconocer la consulta sin abrirla.
- **La audiencia entre corchetes** se lee de un vistazo y sirve para filtrar en
  Gmail.

**La versión actual no lleva la hora en el asunto.** Una versión anterior la
ponía ("— 03/09 15:10") para que dos consultas nunca compartieran asunto: si la
misma persona escribe dos veces, Gmail agrupa los dos avisos en una sola
conversación. Sin la hora eso vuelve a pasar. La fecha y la hora sí están en el
cuerpo del aviso. Si se quiere recuperar, es un cambio de una línea en
`notificarEquipo_`.

El cuerpo trae todos los campos del formulario. En las postulaciones incluye el
link al CV ya copiado al Drive, o "No adjuntó archivo".

El **"Responder a" apunta a quien escribió**, así que desde el aviso se le
contesta directamente, sin copiar la dirección a mano.

A quién le llega se configura en `NOTIFICAR_A`, arriba del script. Acepta
varias direcciones. Si se deja vacío, no se manda ningún aviso.

### Qué hacer con la notificación de Netlify

Conviene **dejarla prendida unas semanas** y recién después apagarla, por una
razón concreta: el aviso del script depende de que el envío llegue al Apps
Script, así que si ese camino se cae —con el webhook de antes pasó varias veces—
dejás de enterarte de las consultas. El de Netlify es independiente y llega
igual.

Mientras convivan, si molesta verlos duplicados, se puede armar un filtro en
Gmail que archive los de Netlify bajo una etiqueta: quedan como respaldo sin
ocupar la bandeja.

Para apagarla: Netlify → Forms → Settings & usage → Form notifications →
Options → Delete, en las dos notificaciones por mail.

## Postulaciones: pestaña propia y CV en el Drive

El formulario de `/sumate` se comporta como los otros dos en un punto y se aparta en otro, y el que se aparta vale para cualquier formulario que reciba archivos.

**Va a la misma planilla que el resto de los contactos web**, en su propia pestaña. Los tres formularios comparten el Sheet y cada uno tiene la suya; la pestaña se crea sola la primera vez que entra un envío, así que no hay nada que configurar a mano. Hubo una versión anterior que mandaba las postulaciones a una planilla separada (*PsiquiatriX — Postulaciones*): quedó descartada, todo va a un solo archivo.

**El CV no se queda en Netlify.** Netlify guarda el archivo en una URL larga y difícil de adivinar, pero **sin contraseña**: quien tenga el link entra. Un CV trae teléfono, a veces domicilio, y la trayectoria laboral completa de una persona. El script lo baja, lo copia a una carpeta del Drive y en la planilla deja el link de Drive. Ahí el archivo tiene los permisos que ustedes le pongan.

### En qué carpeta se guardan

La carpeta la define la propiedad del script **`ID_CARPETA_CV`** (editor de Apps Script → engranaje *Configuración del proyecto* → *Propiedades del script*). Su valor es el **identificador** de la carpeta: el tramo del link entre `/folders/` y el `?`. No el link entero.

Para cambiar de carpeta:

1. La cuenta dueña del Sheet (`psiquiatrix.online@gmail.com`) tiene que ser **Editor** de la carpeta nueva. Con verla no alcanza: tiene que poder crear archivos.
2. Reemplazar el valor de `ID_CARPETA_CV` por el identificador nuevo y guardar.
3. Mandar una postulación de prueba y ver que el CV aparezca ahí.

No hace falta tocar el código ni publicar una versión nueva: la propiedad se lee en cada envío.

**Si el script no puede abrir la carpeta, no avisa**: crea una propia llamada *PsiquiatriX — CV de postulaciones* en la unidad de la cuenta dueña y cambia `ID_CARPETA_CV` para que apunte a esa. Los CV se siguen guardando, pero en otro lado. Si después de un cambio de carpeta los CV no aparecen donde se esperaba, mirar primero los permisos y el valor de la propiedad.

Los CV que ya estaban en la carpeta vieja no se mueven solos. Se pueden arrastrar a mano: los links de la planilla siguen andando, porque Drive conserva el enlace de cada archivo aunque cambie de carpeta.

Los archivos se guardan como `Nombre Apellido — CV.pdf`. Sin eso quedan todos con el nombre que puso cada persona, y buscar entre treinta `cv.pdf` no sirve de nada.

**Si la copia al Drive falla** —se cayó la red, cambió la URL— la celda queda con el link original de Netlify y la aclaración de que no se pudo copiar. Es preferible tener el CV en un lugar menos ideal que perderlo.

### Cómo leer la celda de CV

La celda tiene que traer **un link de `drive.google.com`**. Cualquier otra cosa significa que el archivo no se copió y sigue solo en Netlify:

| Lo que dice la celda | Qué pasó |
|---|---|
| `https://drive.google.com/file/d/…` | Bien. El CV está en la carpeta del Drive. |
| `{"url":"https://…netlify…","filename":…}` con la fila en `PENDIENTE` | Todavía no se procesó. Es normal durante uno o dos minutos. |
| `https://…netlify… (no se pudo copiar al Drive)` | Falló la copia. Bajarlo a mano desde ese link. Suele ser un tema de permisos: ver *Puesta en marcha*, paso 2. |
| `No adjuntó archivo` | La persona no adjuntó nada, o Netlify mandó el campo en un formato que el script no reconoce. |

Netlify manda el campo del archivo como un **objeto** —`{ url, filename, size, type }`— y no como una URL suelta. `doPost` lo guarda tal cual en la celda, y `procesarPendientes` lo lee, copia el archivo y reemplaza el contenido de la celda por el link de Drive. Si una fila ya dice `PROCESADO` y la celda del CV sigue con el objeto entero, algo falló en ese paso.

## Registro de envíos

El script anota cada intento en la pestaña **`log-autoreply`**: fecha,
formulario, destinatario, si salió o no, y el detalle. Aparecen los dos mails:
el aviso al equipo va marcado como `(aviso al equipo)`. Es el primer lugar donde
mirar si alguien dice que no le llegó nada.

Un envío que falla **nunca** frena el registro del contacto: la fila se guarda
primero y el mail va después. Si el mail falla, el contacto está igual.

Ojo: la columna `Estado Proceso` pasa a `PROCESADO` aunque algún mail haya
fallado. Para saber si salieron, el lugar es este registro, no esa columna.

## Límites de envío

Una cuenta de Gmail común permite **100 destinatarios por día** desde Apps
Script (una cuenta de Google Workspace, 1.500). Con el volumen actual sobra de
lejos, pero el script chequea la cuota antes de mandar y, si está agotada,
registra "no enviado" en el log en vez de romper.

## Si algo no anda

| Síntoma | Causa más probable |
| --- | --- |
| No llega ningún mail | Falta el paso 3: la implementación sigue en la versión vieja. |
| La fila está en `PENDIENTE` hace más de 5 minutos | La corrida en segundo plano no se ejecutó. Correr `procesarPendientes` a mano desde el editor: procesa todas las pendientes. |
| No llega nada y el envío no está en la planilla | Mirá la lista de spam del formulario en Netlify: ahí no se procesa. |
| No llega y el log dice "no enviado" | Mirá la columna Detalle: casi siempre es cuota agotada o dirección inválida. |
| No llega y el log está vacío | El envío no llegó al Apps Script. Es un problema del Sheet, no del mail: revisá la otra guía y el registro de la función en Netlify (Logs → Functions). |
| Llega desde otra dirección | El alias no está cargado. Ver *La dirección del remitente*. |
| Llega dos veces | El dedup por `id` no está funcionando: revisá que la columna ID exista en la pestaña del formulario. |
| Cae en spam | Falta reputación de la dirección. Es esperable al principio; se corrige solo con el uso. |

## Pendiente

El texto de arranque es provisorio: dice que se responde "dentro de las próximas
horas hábiles". **Falta definir la promesa real** —si se aclara un horario de
atención, si se da un plazo concreto— y escribir la versión definitiva de los
mails. Se cambia en la pestaña `plantillas-mail`, sin tocar código.

También queda pendiente que la política de privacidad mencione este correo: es
un uso más de los datos de la persona.
