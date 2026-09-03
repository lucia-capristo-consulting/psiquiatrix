import { useId, useState } from 'react';
import { CODIGOS_TELEFONO, CODIGO_POR_DEFECTO } from '../data/codigos-telefono';

const soloDigitos = (s) => String(s).replace(/\D/g, '');

function normalizarCodigo(c) {
  const d = soloDigitos(c);
  return d ? '+' + d : '';
}

/**
 * Teléfono con código de país. Arranca en +54 pero se puede escribir cualquier
 * otro: es un input con lista de sugerencias, no un desplegable cerrado.
 *
 * Al equipo le importa que el número venga con código de país porque el
 * contacto se hace por WhatsApp, y sin el código no se puede escribir.
 *
 * Los dos campos visibles NO tienen `name`, así que no se envían por separado:
 * lo que viaja es un único campo `telefono` con el valor ya armado. De ese modo
 * la columna del Sheet y el stub de index.html siguen igual.
 */
export default function CampoTelefono({ required = false, className = '' }) {
  const [codigo, setCodigo] = useState(CODIGO_POR_DEFECTO);
  const [numero, setNumero] = useState('');
  const listaId = 'cod-tel-' + useId().replace(/:/g, '');

  const numeroLimpio = numero.trim();
  const valor = numeroLimpio ? (normalizarCodigo(codigo) + ' ' + numeroLimpio).trim() : '';
  const esArgentina = soloDigitos(codigo) === '54';

  return (
    <div>
      <input type="hidden" name="telefono" value={valor} />

      <div className="flex items-end gap-3">
        <input
          list={listaId}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          inputMode="tel"
          aria-label="Código de país"
          className={`${className} w-[76px] flex-shrink-0`}
        />
        <datalist id={listaId}>
          {CODIGOS_TELEFONO.map((c) => (
            <option key={c.codigo + c.pais} value={c.codigo}>
              {c.pais}
            </option>
          ))}
        </datalist>

        <input
          type="tel"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required={required}
          placeholder="—"
          autoComplete="tel-national"
          aria-label="Número de teléfono"
          className={`${className} flex-1 min-w-0`}
        />
      </div>

      {esArgentina && (
        <p className="mt-1.5 text-[11px] leading-[1.5] text-taupe m-0">
          Sin el 0 de área ni el 15. Por ejemplo: 11 5555 5555
        </p>
      )}
    </div>
  );
}
