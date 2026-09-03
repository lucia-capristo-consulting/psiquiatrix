import { useState } from 'react';
import { FORMATO_MAIL, sugerirDominio } from '../lib/validarMail';

/**
 * Campo de mail con dos niveles de control:
 *
 *   - El formato se valida con `pattern` y BLOQUEA el envío. Es más estricto
 *     que `type="email"` solo, que acepta "juan@gmail" sin dominio.
 *   - Los dominios mal tipeados (gmail.con, hotmial.com) se detectan al salir
 *     del campo y se SUGIERE la corrección, sin bloquear: quien tenga un
 *     dominio propio parecido a uno conocido puede ignorarla.
 *
 * Por qué no se verifica que la casilla exista: haría falta preguntarle a un
 * servicio de terceros, y eso implica mandarle la dirección de la persona.
 * Ver src/lib/validarMail.js.
 */
export default function CampoMail({ required = false, className = '' }) {
  const [valor, setValor] = useState('');
  const [sugerencia, setSugerencia] = useState(null);

  return (
    <div>
      <input
        type="email"
        name="mail"
        value={valor}
        required={required}
        pattern={FORMATO_MAIL}
        title="Escribí una dirección completa, por ejemplo nombre@gmail.com"
        placeholder="—"
        autoComplete="email"
        onChange={(e) => {
          setValor(e.target.value);
          if (sugerencia) setSugerencia(null);
        }}
        onBlur={(e) => setSugerencia(sugerirDominio(e.target.value))}
        className={className}
      />

      {sugerencia && (
        <p className="mt-1.5 text-[11px] leading-[1.5] text-taupe m-0">
          ¿Quisiste decir{' '}
          <button
            type="button"
            onClick={() => {
              setValor(sugerencia);
              setSugerencia(null);
            }}
            className="text-accent underline underline-offset-2 hover:text-graphite transition-colors"
          >
            {sugerencia}
          </button>
          ?
        </p>
      )}
    </div>
  );
}
