import { useState } from 'react';
import { CODIGOS_TELEFONO, CODIGO_POR_DEFECTO, OTRO } from '../data/codigos-telefono';

const PAIS_POR_DEFECTO = 'Argentina';

const soloDigitos = (s) => String(s).replace(/\D/g, '');

function normalizarCodigo(c) {
  const d = soloDigitos(c);
  return d ? '+' + d : '';
}

/**
 * Teléfono con código de país. Arranca en Argentina y el desplegable se abre
 * como cualquier otro, mostrando la lista completa en orden alfabético.
 *
 * Antes esto era un input con datalist. No servía: el datalist filtra las
 * sugerencias por lo que hay escrito, así que con "+54" en el campo la lista
 * mostraba una sola opción y había que borrar el contenido para ver el resto.
 *
 * Al final de la lista hay "Otro país", que habilita escribir el código a
 * mano: la lista es larga pero no exhaustiva, y nadie tiene que quedarse sin
 * poder dejar su teléfono.
 *
 * Importa que el número venga con código de país porque el contacto se hace
 * por WhatsApp, y sin código no se puede escribir.
 *
 * Los campos visibles NO tienen `name`: lo que se envía es un único campo
 * `telefono` ya armado, así que la columna del Sheet y el stub de index.html
 * quedan igual.
 */
export default function CampoTelefono({ required = false, className = '' }) {
  const [pais, setPais] = useState(PAIS_POR_DEFECTO);
  const [codigoManual, setCodigoManual] = useState('');
  const [numero, setNumero] = useState('');

  const elegido = CODIGOS_TELEFONO.find((c) => c.pais === pais);
  const codigo =
    pais === OTRO
      ? normalizarCodigo(codigoManual)
      : elegido
        ? elegido.codigo
        : CODIGO_POR_DEFECTO;

  const numeroLimpio = numero.trim();
  const valor = numeroLimpio ? (codigo + ' ' + numeroLimpio).trim() : '';
  const esArgentina = soloDigitos(codigo) === '54';

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="telefono" value={valor} />

      <div className="flex items-end gap-3">
        <div className="relative flex-1 min-w-0">
          <select
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            aria-label="País"
            className={`${className} appearance-none w-full pr-8 cursor-pointer`}
            style={{ fontStyle: 'normal' }}
          >
            {CODIGOS_TELEFONO.map((c) => (
              <option key={c.pais} value={c.pais}>
                {c.pais} ({c.codigo})
              </option>
            ))}
            <option value={OTRO}>Otro país…</option>
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-taupe text-[14px]"
          >
            ▾
          </span>
        </div>

        {pais === OTRO && (
          <input
            type="text"
            value={codigoManual}
            onChange={(e) => setCodigoManual(e.target.value)}
            inputMode="tel"
            placeholder="+00"
            aria-label="Código de país"
            className={`${className} w-[84px] flex-shrink-0`}
          />
        )}
      </div>

      <input
        type="tel"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        required={required}
        placeholder="—"
        autoComplete="tel-national"
        aria-label="Número de teléfono"
        className={className}
      />

      {esArgentina && (
        <p className="-mt-1 text-[11px] leading-[1.5] text-taupe m-0">
          Sin el 0 de área ni el 15. Por ejemplo: 11 5555 5555
        </p>
      )}
    </div>
  );
}
