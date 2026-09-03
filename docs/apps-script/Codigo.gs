/**
 * Netlify Forms -> Google Sheets + auto-reply
 *
 * Este archivo es la COPIA DE REFERENCIA del script que vive dentro del Google
 * Sheet de contactos (Extensiones -> Apps Script). El repo no puede ejecutarlo:
 * esta aca para tener historial, poder revisar cambios y no depender de que
 * alguien recuerde que habia escrito. Si se edita el script en Google, hay que
 * traer el cambio a este archivo, y al reves.
 *
 * Hace dos cosas por cada envio de formulario:
 *   1. Agrega una fila al Sheet, en una pestaña por formulario.
 *   2. Le manda un mail de confirmacion a la persona que escribio.
 *
 * Guias: docs/contactos-google-sheets.md y docs/auto-reply-formularios.md
 */

// ===========================================================================
// TITULOS DE LAS COLUMNAS
// ===========================================================================
// Editá el texto de la DERECHA. NO toques la clave de la izquierda: es el
// nombre interno del campo del formulario y el script la usa para saber que
// valor va en cada columna.

var ETIQUETAS = {
  id: 'ID',
  Fecha: 'Fecha',
  nombre: 'Nombre y apellido',
  telefono: 'Teléfono',
  mail: 'Email',
  destinatario: 'Para quién es',     // solo contacto-pacientes
  conocimiento: 'Cómo nos conoció',
  mensaje: 'Mensaje',
  profesion: 'Profesión',            // solo contacto-psicologos
  intencion: 'Intención de derivar', // solo contacto-psicologos
};

// ===========================================================================
// AUTO-REPLY: configuracion
// ===========================================================================

// Direccion desde la que sale el mail. Para que salga REALMENTE de aca, el
// script tiene que ser propiedad de esa cuenta, o esa direccion tiene que
// estar cargada como alias verificado ("Enviar como") en la cuenta dueña.
// Ver docs/auto-reply-formularios.md.
var REMITENTE = 'psiquiatrix.online@gmail.com';
var NOMBRE_REMITENTE = 'PsiquiatriX';

// Pestañas que usa el auto-reply. Se crean solas la primera vez.
var HOJA_PLANTILLAS = 'plantillas-mail';
var HOJA_LOG = 'log-autoreply';

var SITIO = 'https://www.psiquiatrix.ar';
var LOGO_URL = SITIO + '/marca/logo-psiquiatrix-transparente.png';

// Textos de arranque. SOLO se usan para llenar la pestaña "plantillas-mail" la
// primera vez, o si esa pestaña quedara vacia. Lo normal es editar el texto EN
// EL SHEET: eso no requiere volver a desplegar el script.
//
// {{nombre}} se reemplaza por el primer nombre de quien escribio. Los parrafos
// se separan con un renglon en blanco (Alt+Enter dentro de la celda).
var PLANTILLAS_POR_DEFECTO = {
  'contacto-pacientes': {
    asunto: 'Recibimos tu consulta',
    cuerpo:
      'Hola {{nombre}}:\n\n' +
      'Recibimos tu mensaje y queríamos confirmarte que llegó bien.\n\n' +
      'Cada consulta la lee una persona del equipo. Vamos a responderte por ' +
      'este mismo medio dentro de las próximas horas hábiles.\n\n' +
      'No hace falta que respondas este correo: es sólo la confirmación de ' +
      'que tu mensaje está con nosotros.',
    aviso:
      'Si estás atravesando una urgencia y necesitás atención inmediata, no ' +
      'esperes nuestra respuesta: acudí a la guardia del hospital más cercano ' +
      'o llamá al 911.',
  },
  'contacto-psicologos': {
    asunto: 'Recibimos tu consulta',
    cuerpo:
      'Hola {{nombre}}:\n\n' +
      'Recibimos tu mensaje y queríamos confirmarte que llegó bien.\n\n' +
      'Vamos a responderte dentro de las próximas horas hábiles para coordinar ' +
      'una primera conversación profesional.\n\n' +
      'No hace falta que respondas este correo: es sólo la confirmación de ' +
      'que tu mensaje está con nosotros.',
    aviso: '',
  },
};

// ===========================================================================
// ENTRADA: el webhook de Netlify
// ===========================================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // serializa llegadas concurrentes para que el dedup funcione
  try {
    var body = JSON.parse(e.postData.contents);
    var formName = body.form_name || 'sin-nombre';
    var data = body.data || {};
    var createdAt = body.created_at || new Date().toISOString();
    var submissionId = body.id || '';

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(formName) || ss.insertSheet(formName);

    // Campos internos a ignorar (honeypot antispam / form-name)
    var skip = { 'bot-field': true, 'form-name': true };
    var fields = Object.keys(data).filter(function (k) { return !skip[k]; });

    // Orden interno de columnas (claves de campo, NO los títulos visibles)
    var keys = ['id', 'Fecha'].concat(fields);

    // Encabezados la primera vez: escribo los títulos lindos de ETIQUETAS
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(keys.map(function (k) { return ETIQUETAS[k] || k; }));
    }

    // Mapa título-visible -> clave-de-campo, para saber qué valor va en cada columna
    var keyByLabel = {};
    Object.keys(ETIQUETAS).forEach(function (k) { keyByLabel[ETIQUETAS[k]] = k; });

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headerKeys = headers.map(function (h) { return keyByLabel[h] || h; });

    // Dedup: si ya existe este id de envío, no agrego otra fila NI mando otro
    // mail. Netlify reintenta el webhook ante un error, y sin esto la persona
    // recibiria la confirmacion dos veces.
    var idCol = headerKeys.indexOf('id');
    if (submissionId && idCol !== -1 && sheet.getLastRow() > 1) {
      var ids = sheet.getRange(2, idCol + 1, sheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(submissionId)) {
          return respuesta_({ ok: true, duplicate: true });
        }
      }
    }

    // Alineo cada valor a su columna, resolviendo el título a su clave de campo
    var row = headerKeys.map(function (key) {
      if (key === 'id') return submissionId;
      if (key === 'Fecha') return createdAt;
      return data[key] !== undefined ? data[key] : '';
    });
    sheet.appendRow(row);

    // El mail va DESPUES de guardar la fila y nunca puede tumbar la respuesta:
    // si falla el envio, el contacto igual quedo registrado.
    var envio;
    try {
      envio = enviarAutoReply_(formName, data);
    } catch (err) {
      envio = { ok: false, detalle: String(err) };
    }
    registrarEnvio_(formName, data.mail, envio);

    return respuesta_({ ok: true, mail: envio.ok });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===========================================================================
// AUTO-REPLY: envio
// ===========================================================================

function enviarAutoReply_(formName, datos) {
  var destino = String(datos.mail || '').trim();
  if (!esMailValido_(destino)) return { ok: false, detalle: 'sin direccion valida' };

  var plantilla = plantillaPara_(formName);
  if (!plantilla) return { ok: false, detalle: 'no hay plantilla para ' + formName };

  if (MailApp.getRemainingDailyQuota() < 1) {
    return { ok: false, detalle: 'cuota diaria de envio agotada' };
  }

  var mail = armarMail_(plantilla, datos);
  var opciones = {
    name: NOMBRE_REMITENTE,
    htmlBody: mail.html,
    replyTo: REMITENTE,
  };

  // Si la cuenta dueña del script tiene cargado el remitente como alias, se usa.
  // Si el dueño YA ES esa cuenta, getAliases() no la lista y el mail sale de
  // ella igual: por eso no es un error que no haya alias.
  var alias = aliasDisponible_();
  if (alias) opciones.from = alias;

  GmailApp.sendEmail(destino, mail.asunto, mail.texto, opciones);

  return {
    ok: true,
    detalle: alias ? 'enviado con alias ' + alias : 'enviado como la cuenta dueña',
  };
}

function aliasDisponible_() {
  try {
    var alias = GmailApp.getAliases();
    for (var i = 0; i < alias.length; i++) {
      if (String(alias[i]).toLowerCase() === REMITENTE.toLowerCase()) return alias[i];
    }
  } catch (err) {
    // Sin permisos de Gmail o cuenta sin alias: se sigue con la cuenta dueña.
  }
  return null;
}

function esMailValido_(m) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(m || '').trim());
}

function primerNombre_(nombre) {
  var n = String(nombre || '').trim();
  if (!n) return '';
  return n.split(/\s+/)[0];
}

// ===========================================================================
// AUTO-REPLY: plantillas
// ===========================================================================

/**
 * Devuelve la plantilla del formulario, leida de la pestaña "plantillas-mail".
 * Si la pestaña no existe, la crea con los textos de PLANTILLAS_POR_DEFECTO.
 * Desde entonces manda lo que diga el Sheet: editar ahi NO requiere desplegar
 * el script de nuevo.
 */
function plantillaPara_(formName) {
  var hoja = asegurarHojaPlantillas_();
  if (hoja && hoja.getLastRow() > 1) {
    var filas = hoja.getRange(2, 1, hoja.getLastRow() - 1, 4).getValues();
    for (var i = 0; i < filas.length; i++) {
      if (String(filas[i][0]).trim() === formName) {
        var t = {
          asunto: String(filas[i][1] || '').trim(),
          cuerpo: String(filas[i][2] || '').trim(),
          aviso: String(filas[i][3] || '').trim(),
        };
        if (t.asunto && t.cuerpo) return t;
      }
    }
  }
  return PLANTILLAS_POR_DEFECTO[formName] || null;
}

function asegurarHojaPlantillas_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(HOJA_PLANTILLAS);
  if (hoja) return hoja;

  hoja = ss.insertSheet(HOJA_PLANTILLAS);
  hoja.appendRow(['Formulario', 'Asunto', 'Cuerpo del mail', 'Aviso destacado']);
  hoja.getRange(1, 1, 1, 4).setFontWeight('bold');

  Object.keys(PLANTILLAS_POR_DEFECTO).forEach(function (k) {
    var p = PLANTILLAS_POR_DEFECTO[k];
    hoja.appendRow([k, p.asunto, p.cuerpo, p.aviso]);
  });

  hoja.setColumnWidth(1, 170);
  hoja.setColumnWidth(2, 220);
  hoja.setColumnWidth(3, 520);
  hoja.setColumnWidth(4, 380);
  hoja.getRange(2, 1, hoja.getLastRow() - 1, 4)
    .setWrap(true)
    .setVerticalAlignment('top');
  hoja.setFrozenRows(1);
  return hoja;
}

// ===========================================================================
// AUTO-REPLY: armado del mail
// ===========================================================================

function armarMail_(plantilla, datos) {
  var nombre = primerNombre_(datos.nombre);

  var cuerpo = String(plantilla.cuerpo).replace(/\{\{nombre\}\}/g, nombre);
  // Sin nombre, "Hola {{nombre}}:" quedaria como "Hola :". Se limpia el espacio
  // que sobra antes de la puntuacion.
  cuerpo = cuerpo.replace(/[ \t]+([:,.])/g, '$1');

  var parrafos = cuerpo.split(/\n\s*\n/).map(function (p) {
    return p.replace(/\s*\n\s*/g, ' ').trim();
  }).filter(function (p) { return p.length > 0; });

  var aviso = String(plantilla.aviso || '').replace(/\{\{nombre\}\}/g, nombre).trim();

  return {
    asunto: String(plantilla.asunto).replace(/\{\{nombre\}\}/g, nombre).trim(),
    texto: textoPlano_(parrafos, aviso),
    html: html_(parrafos, aviso),
  };
}

function textoPlano_(parrafos, aviso) {
  var partes = parrafos.slice();
  if (aviso) partes.push('--\n' + aviso);
  partes.push('--\nPsiquiatriX\n' + SITIO);
  partes.push('Este es un mensaje automático de confirmación.');
  return partes.join('\n\n');
}

function escapar_(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * HTML de mail: tablas y estilos en linea, porque los clientes de correo no
 * soportan hojas de estilo ni fuentes propias. Las tipografias de la marca
 * (Instrument Serif / Inter Tight) NO se pueden usar aca: se reemplazan por
 * Georgia y Arial, que existen en todos lados y guardan el mismo aire.
 * El mail tiene que leerse bien aunque el cliente bloquee la imagen.
 */
function html_(parrafos, aviso) {
  var cuerpo = parrafos.map(function (p) {
    return '<p style="margin:0 0 16px 0;">' + escapar_(p) + '</p>';
  }).join('');

  var bloqueAviso = '';
  if (aviso) {
    bloqueAviso =
      '<tr><td style="padding:8px 36px 0 36px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
          '<tr><td style="background:#F2EDE4;border-left:3px solid #B8541F;padding:16px 18px;' +
            'font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#3C3833;">' +
            escapar_(aviso) +
          '</td></tr>' +
        '</table>' +
      '</td></tr>';
  }

  return '' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F2EDE4;margin:0;padding:0;">' +
    '<tr><td align="center" style="padding:32px 16px;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;background:#FFFFFF;border:1px solid #D9CFB8;">' +

        '<tr><td style="padding:36px 36px 0 36px;">' +
          '<img src="' + LOGO_URL + '" alt="PsiquiatriX" width="150" ' +
            'style="display:block;border:0;outline:none;width:150px;max-width:150px;height:auto;" />' +
        '</td></tr>' +

        '<tr><td style="padding:28px 36px 0 36px;font-family:Arial,Helvetica,sans-serif;' +
          'font-size:15px;line-height:1.7;color:#3C3833;">' + cuerpo +
        '</td></tr>' +

        bloqueAviso +

        '<tr><td style="padding:24px 36px 36px 36px;font-family:Georgia,\'Times New Roman\',serif;' +
          'font-size:17px;line-height:1.4;color:#3C3833;">' +
          'Equipo de PsiquiatriX' +
        '</td></tr>' +

      '</table>' +

      '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:100%;">' +
        '<tr><td align="center" style="padding:18px 12px 0 12px;font-family:Arial,Helvetica,sans-serif;' +
          'font-size:12px;line-height:1.6;color:#7A6F5E;">' +
          '<a href="' + SITIO + '" style="color:#7A6F5E;text-decoration:underline;">www.psiquiatrix.ar</a>' +
          '<br />Este es un mensaje automático de confirmación.' +
        '</td></tr>' +
      '</table>' +

    '</td></tr>' +
  '</table>';
}

// ===========================================================================
// REGISTRO DE ENVIOS
// ===========================================================================

function registrarEnvio_(formName, destino, resultado) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName(HOJA_LOG);
    if (!hoja) {
      hoja = ss.insertSheet(HOJA_LOG);
      hoja.appendRow(['Fecha', 'Formulario', 'Destinatario', 'Estado', 'Detalle']);
      hoja.getRange(1, 1, 1, 5).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }
    hoja.appendRow([
      new Date(),
      formName,
      String(destino || ''),
      resultado.ok ? 'enviado' : 'no enviado',
      String(resultado.detalle || ''),
    ]);
  } catch (err) {
    // El log nunca puede romper el flujo principal.
  }
}

// ===========================================================================
// PRUEBA MANUAL
// ===========================================================================

/**
 * Corré esta funcion desde el editor de Apps Script (boton Ejecutar).
 *
 * Sirve para dos cosas:
 *   1. Dispara el pedido de permisos de Gmail la primera vez. Sin esto, el
 *      auto-reply falla en silencio cuando llega un formulario de verdad.
 *   2. Manda los dos mails de prueba a tu propia direccion, para ver como
 *      quedan antes de que los reciba alguien.
 *
 * No toca las pestañas de contactos: solo escribe en el log.
 */
function probarAutoReply() {
  var yo = Session.getEffectiveUser().getEmail();
  Logger.log('Enviando pruebas a: ' + yo);
  Logger.log('Envios que quedan hoy: ' + MailApp.getRemainingDailyQuota());

  var alias = aliasDisponible_();
  Logger.log(alias
    ? 'El mail va a salir de: ' + alias
    : 'SIN ALIAS: el mail va a salir de ' + yo + '. Ver docs/auto-reply-formularios.md');

  ['contacto-pacientes', 'contacto-psicologos'].forEach(function (form) {
    var r = enviarAutoReply_(form, { nombre: 'Prueba Apellido', mail: yo });
    Logger.log(form + ' -> ' + (r.ok ? 'OK' : 'FALLO') + ' (' + r.detalle + ')');
    registrarEnvio_(form + ' (prueba)', yo, r);
  });
}
