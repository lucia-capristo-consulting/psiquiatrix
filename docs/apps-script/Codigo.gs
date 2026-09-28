/**
 * Netlify Forms -> Google Sheets + Auto-reply (Asíncrono)
 * 
 * Incluye enlace directo al CV en la notificación al equipo (o aviso de 'No adjuntó archivo').
 */

// ===========================================================================
// TITULOS DE LAS COLUMNAS
// ===========================================================================
var ETIQUETAS = {
  Fecha: 'Fecha',
  Hora: 'Hora',
  EstadoProceso: 'Estado Proceso',
  nombre: 'Nombre y apellido',
  telefono: 'Teléfono',
  mail: 'Email',
  destinatario: 'Para quién es',
  conocimiento: 'Cómo nos conoció',
  mensaje: 'Mensaje',
  cv: 'CV',
  profesion: 'Profesión',
  enfoque: 'Enfoque terapéutico',
  intencion: 'Intención de derivar',
  instancia: 'Instancia de formación',
  id: 'ID',
};

// ===========================================================================
// CONFIGURACION GENERAL
// ===========================================================================
var REMITENTE = 'psiquiatrix.online@gmail.com';
var NOMBRE_REMITENTE = 'PsiquiatriX';

var HOJA_PLANTILLAS = 'plantillas-mail';
var HOJA_LOG = 'log-autoreply';

var CAMPOS_ARCHIVO = { 'contacto-sumate': ['cv'] };
var PROP_CARPETA_CV = 'ID_CARPETA_CV';
var NOMBRE_CARPETA_CV = 'PsiquiatriX — CV de postulaciones';

var NOTIFICAR_A = ['psiquiatrix.online@gmail.com'];
var ZONA = 'America/Argentina/Buenos_Aires';

var NOMBRE_AUDIENCIA = {
  'contacto-pacientes': 'Pacientes',
  'contacto-psicologos': 'Psicólogos',
  'contacto-sumate': 'Postulaciones',
};

var SITIO = 'https://www.psiquiatrix.ar';
var LOGO_URL = SITIO + '/marca/logo-psiquiatrix-transparente.png';

var PLANTILLAS_POR_DEFECTO = {
  'contacto-pacientes': {
    asunto: '{{nombre}}, recibimos tu consulta',
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
    asunto: '{{nombre}}, recibimos tu consulta profesional',
    cuerpo:
      'Hola {{nombre}}:\n\n' +
      'Recibimos tu mensaje y queríamos confirmarte que llegó bien.\n\n' +
      'Vamos a responderte dentro de las próximas horas hábiles para coordinar ' +
      'una primera conversación profesional.\n\n' +
      'No hace falta que respondas este correo: es sólo la confirmación de ' +
      'que tu mensaje está con nosotros.',
    aviso: '',
  },
  'contacto-sumate': {
    asunto: '{{nombre}}, recibimos tu postulación',
    cuerpo:
      'Hola {{nombre}}:\n\n' +
      'Recibimos tu postulación y queríamos confirmarte que llegó bien.\n\n' +
      'La vamos a leer con atención y te vamos a escribir, te sumemos o no al ' +
      'equipo.\n\n' +
      'Si todavía no nos mandaste tu CV, podés responder este correo con el ' +
      'archivo adjunto.',
    aviso: '',
  },
};

// ===========================================================================
// ENTRADA: WEBHOOK NETLIFY (BLINDADO - RESPUESTA HTTP 200 INMEDIATA)
// ===========================================================================
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respuesta_({ ok: true, message: 'Ping or empty payload' });
    }

    var body = {};
    try {
      body = JSON.parse(e.postData.contents);
    } catch (pErr) {
      return respuesta_({ ok: true, message: 'Invalid JSON payload' });
    }

    var formName = body.form_name || 'sin-nombre';
    var data = body.data || {};
    var createdAt = body.created_at || new Date().toISOString();
    var submissionId = body.id || '';

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(formName) || ss.insertSheet(formName);

    var skip = { 'bot-field': true, 'form-name': true };
    var fields = Object.keys(data).filter(function (k) { return !skip[k]; });

    var keys = ['Fecha', 'Hora', 'EstadoProceso'].concat(fields);
    if (keys.indexOf('id') === -1) {
      keys.push('id');
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(keys.map(function (k) { return ETIQUETAS[k] || k; }));
    }

    var keyByLabel = {};
    Object.keys(ETIQUETAS).forEach(function (k) { keyByLabel[ETIQUETAS[k]] = k; });

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headerKeys = headers.map(function (h) { return keyByLabel[h] || h; });

    // Asegurar que exista EstadoProceso en la hoja si no estaba
    if (headerKeys.indexOf('EstadoProceso') === -1) {
      sheet.insertColumnAfter(2); // Insertar como Columna C
      sheet.getRange(1, 3).setValue(ETIQUETAS.EstadoProceso);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      headerKeys = headers.map(function (h) { return keyByLabel[h] || h; });
    }

    var faltantes = fields.filter(function (k) { return headerKeys.indexOf(k) === -1; });
    if (faltantes.length) {
      var insertIdx = headerKeys.indexOf('id');
      if (insertIdx !== -1) {
        sheet.insertColumnsAfter(insertIdx, faltantes.length);
        sheet.getRange(1, insertIdx + 1, 1, faltantes.length)
          .setValues([faltantes.map(function (k) { return ETIQUETAS[k] || k; })]);
      } else {
        sheet.getRange(1, sheet.getLastColumn() + 1, 1, faltantes.length)
          .setValues([faltantes.map(function (k) { return ETIQUETAS[k] || k; })]);
      }
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      headerKeys = headers.map(function (h) { return keyByLabel[h] || h; });
    }

    // Dedup por ID de envío
    var idCol = headerKeys.indexOf('id');
    if (submissionId && idCol !== -1 && sheet.getLastRow() > 1) {
      var ids = sheet.getRange(2, idCol + 1, sheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(submissionId)) {
          return respuesta_({ ok: true, duplicate: true });
        }
      }
    }

    var dateObj = new Date(createdAt);
    if (isNaN(dateObj.getTime())) dateObj = new Date();
    
    var fechaStr = Utilities.formatDate(dateObj, ZONA, 'dd/MM/yyyy');
    var horaStr = Utilities.formatDate(dateObj, ZONA, 'HH:mm:ss');

    var row = headerKeys.map(function (key) {
      if (key === 'Fecha') return fechaStr;
      if (key === 'Hora') return horaStr;
      if (key === 'EstadoProceso') return 'PENDIENTE';
      if (key === 'id') return submissionId;

      var val = data[key];

      if (key === 'telefono' && val) {
        var telStr = String(val).trim();
        if (telStr.indexOf('+') === 0) {
          return "'" + telStr;
        }
        return telStr;
      }

      if (val !== undefined && typeof val === 'object') {
        return JSON.stringify(val);
      }
      return val !== undefined ? val : '';
    });

    sheet.appendRow(row);

    // Activar el disparador asíncrono
    ScriptApp.newTrigger('procesarPendientes')
      .timeBased()
      .after(1000)
      .create();

    return respuesta_({ ok: true, status: 'enqueued' });

  } catch (err) {
    try {
      registrarEnvio_('ERROR al procesar el envio', '', { ok: false, detalle: String(err) });
    } catch (e2) {}
    return respuesta_({ ok: true, error_captured: String(err) });
  }
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===========================================================================
// TRABAJO EN SEGUNDO PLANO (ARCHIVOS + CORREOS)
// ===========================================================================
function procesarPendientes() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var t = 0; t < triggers.length; t++) {
    if (triggers[t].getHandlerFunction() === 'procesarPendientes') {
      ScriptApp.deleteTrigger(triggers[t]);
    }
  }

  var formularios = ['contacto-pacientes', 'contacto-psicologos', 'contacto-sumate'];
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  formularios.forEach(function (formName) {
    var sheet = ss.getSheetByName(formName);
    if (!sheet || sheet.getLastRow() < 2) return;

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var keyByLabel = {};
    Object.keys(ETIQUETAS).forEach(function (k) { keyByLabel[ETIQUETAS[k]] = k; });
    var headerKeys = headers.map(function (h) { return keyByLabel[h] || h; });

    var estadoCol = headerKeys.indexOf('EstadoProceso');
    if (estadoCol === -1) return;

    var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
    var values = dataRange.getValues();

    for (var r = 0; r < values.length; r++) {
      if (values[r][estadoCol] === 'PENDIENTE') {
        var rowData = {};
        headerKeys.forEach(function (k, colIdx) {
          rowData[k] = values[r][colIdx];
        });

        Object.keys(rowData).forEach(function (k) {
          try {
            if (typeof rowData[k] === 'string' && rowData[k].indexOf('{') === 0) {
              rowData[k] = JSON.parse(rowData[k]);
            }
          } catch (e) {}
        });

        // 1. Mover adjuntos a Drive
        guardarArchivos_(formName, rowData);

        var camposArch = CAMPOS_ARCHIVO[formName] || [];
        camposArch.forEach(function (campo) {
          var cIdx = headerKeys.indexOf(campo);
          if (cIdx !== -1) {
            sheet.getRange(r + 2, cIdx + 1).setValue(rowData[campo]);
          }
        });

        var fechaISO = new Date().toISOString();
        if (rowData.Fecha) {
          fechaISO = rowData.Fecha + (rowData.Hora ? ' ' + rowData.Hora : '');
        }

        // 2. Notificación al equipo (después de actualizar la URL del CV)
        var aviso;
        try {
          aviso = notificarEquipo_(formName, rowData, fechaISO);
        } catch (err) {
          aviso = { ok: false, detalle: String(err) };
        }
        registrarEnvio_(formName + ' (aviso al equipo)', NOTIFICAR_A.join(', '), aviso);

        // 3. Respuesta automática
        var envio;
        try {
          envio = enviarAutoReply_(formName, rowData);
        } catch (err) {
          envio = { ok: false, detalle: String(err) };
        }
        registrarEnvio_(formName, rowData.mail, envio);

        sheet.getRange(r + 2, estadoCol + 1).setValue('PROCESADO');
      }
    }
  });
}

// ===========================================================================
// ARCHIVOS Y DIRECTORIOS
// ===========================================================================
function carpetaCv_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PROP_CARPETA_CV);
  if (id) {
    try {
      return DriveApp.getFolderById(id);
    } catch (err) {}
  }
  var carpeta = DriveApp.createFolder(NOMBRE_CARPETA_CV);
  props.setProperty(PROP_CARPETA_CV, carpeta.getId());
  return carpeta;
}

function guardarArchivos_(formName, data) {
  var campos = CAMPOS_ARCHIVO[formName];
  if (!campos) return;

  var carpeta = null;
  campos.forEach(function (campo) {
    var adjunto = adjuntoDe_(data[campo]);
    if (!adjunto) {
      data[campo] = 'No adjuntó archivo';
      return;
    }

    try {
      if (!carpeta) carpeta = carpetaCv_();
      var blob = UrlFetchApp.fetch(adjunto.url).getBlob();
      var quien = String(data.nombre || 'Sin nombre').trim();
      blob.setName(quien + ' — CV.' + extensionDe_(adjunto));

      var archivoCreado = carpeta.createFile(blob);
      data[campo] = archivoCreado.getUrl();
    } catch (err) {
      data[campo] = adjunto.url + '  (no se pudo copiar al Drive)';
    }
  });
}

function adjuntoDe_(valor) {
  if (!valor) return null;

  if (typeof valor === 'object') {
    var url = String(valor.url || '').trim();
    if (!/^https?:\/\//.test(url)) return null;
    return { url: url, filename: String(valor.filename || '').trim() };
  }

  var suelta = String(valor).trim();
  if (!/^https?:\/\//.test(suelta)) return null;
  return { url: suelta, filename: '' };
}

function extensionDe_(adjunto) {
  var de = function (s) {
    var m = String(s || '').match(/\.([a-zA-Z0-9]{2,5})(?:\?|$)/);
    return m ? m[1].toLowerCase() : '';
  };
  return de(adjunto.filename) || de(adjunto.url) || 'pdf';
}

// ===========================================================================
// ENVIOS Y PLANTILLAS
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
  } catch (err) {}
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

  if (hoja) {
    var existentes = {};
    if (hoja.getLastRow() > 1) {
      hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getValues().forEach(function (f) {
        existentes[String(f[0]).trim()] = true;
      });
    }
    Object.keys(PLANTILLAS_POR_DEFECTO).forEach(function (k) {
      if (existentes[k]) return;
      var p = PLANTILLAS_POR_DEFECTO[k];
      hoja.appendRow([k, p.asunto, p.cuerpo, p.aviso]);
      hoja.getRange(hoja.getLastRow(), 1, 1, 4).setWrap(true).setVerticalAlignment('top');
    });
    return hoja;
  }

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

function armarMail_(plantilla, datos) {
  var nombre = primerNombre_(datos.nombre);
  var cuerpo = String(plantilla.cuerpo).replace(/\{\{nombre\}\}/g, nombre);
  cuerpo = cuerpo.replace(/[ \t]+([:,.])/g, '$1');

  var parrafos = cuerpo.split(/\n\s*\n/).map(function (p) {
    return p.replace(/\s*\n\s*/g, ' ').trim();
  }).filter(function (p) { return p.length > 0; });

  var aviso = String(plantilla.aviso || '').replace(/\{\{nombre\}\}/g, nombre).trim();
  var asunto = String(plantilla.asunto).replace(/\{\{nombre\}\}/g, nombre).trim();

  return {
    asunto: asunto,
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

function notificarEquipo_(formName, data, createdAt) {
  if (!NOTIFICAR_A.length) return { ok: false, detalle: 'sin destinatarios' };
  if (MailApp.getRemainingDailyQuota() < 1) {
    return { ok: false, detalle: 'cuota diaria de envio agotada' };
  }

  var fecha = new Date(createdAt);
  if (isNaN(fecha.getTime())) fecha = new Date();

  var audiencia = NOMBRE_AUDIENCIA[formName] || formName;
  var nombre = String(data.nombre || '').trim() || 'sin nombre';
  
  var asunto = '[' + audiencia + '] Nuevo mensaje de ' + nombre;

  var filas = [];
  Object.keys(ETIQUETAS).forEach(function (k) {
    if (k === 'id' || k === 'Fecha' || k === 'Hora' || k === 'EstadoProceso') return;
    var v = data[k];
    if (v === undefined || String(v).trim() === '') return;
    
    var valStr = String(v).trim();
    // Renderizar enlace HTML si es una URL de Drive
    if (/^https?:\/\//.test(valStr)) {
      valStr = '<a href="' + valStr + '" target="_blank">' + valStr + '</a>';
    }
    filas.push({ etiqueta: ETIQUETAS[k], valorHTML: valStr, valorTexto: String(v).trim() });
  });

  var SALTO = String.fromCharCode(10);
  var texto = filas
    .map(function (f) { return f.etiqueta + ': ' + f.valorTexto; })
    .join(SALTO);
  texto +=
    SALTO + SALTO + 'Recibida: ' +
    Utilities.formatDate(fecha, ZONA, 'dd/MM/yyyy HH:mm');

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3C3833;">' +
    '<p style="margin:0 0 18px 0;font-size:13px;color:#7A6F5E;">' +
    escapar_(audiencia) + ' · ' + escapar_(Utilities.formatDate(fecha, ZONA, 'dd/MM/yyyy HH:mm')) +
    '</p><table cellpadding="0" cellspacing="0" border="0">' +
    filas.map(function (f) {
      return '<tr>' +
        '<td style="padding:6px 18px 6px 0;vertical-align:top;color:#7A6F5E;font-size:13px;white-space:nowrap;">' +
          escapar_(f.etiqueta) +
        '</td>' +
        '<td style="padding:6px 0;vertical-align:top;">' + f.valorHTML + '</td>' +
      '</tr>';
    }).join('') +
    '</table></div>';

  var opciones = { name: NOMBRE_REMITENTE, htmlBody: html };
  if (esMailValido_(data.mail)) opciones.replyTo = String(data.mail).trim();

  var alias = aliasDisponible_();
  if (alias) opciones.from = alias;

  GmailApp.sendEmail(NOTIFICAR_A.join(','), asunto, texto, opciones);
  return { ok: true, detalle: asunto };
}

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
  } catch (err) {}
}