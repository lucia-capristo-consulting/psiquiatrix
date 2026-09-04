import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../../motion';
import { submitNetlifyFormConArchivos } from '../../lib/netlifyForm';
import { trackEvent } from '../../lib/analytics';
import { inputCls, reactivarAlEscribir } from '../../lib/formulario';
import CampoMail from '../CampoMail';
import CampoTelefono from '../CampoTelefono';
import { POSTULACION, INSTANCIAS } from '../../contenido/sumate';
import { MENSAJES_SUMATE, BOTON } from '../../contenido/mensajes-formulario';

const FORM_NAME = 'contacto-sumate';

/**
 * Postulación.
 *
 * El CV se adjunta acá, y por eso este formulario se envía distinto a los
 * otros dos: en multipart, con el FormData tal cual. Serializado como texto,
 * de un archivo viaja el nombre y no el contenido.
 *
 * El archivo NO se queda en Netlify: el Apps Script lo baja y lo guarda en una
 * carpeta del Drive de la institución. Un CV trae teléfono, domicilio y
 * trayectoria completa, y no tiene por qué vivir en una URL pública.
 */
export default function SumateForm() {
  const [instancia, setInstancia] = useState('');
  const [status, setStatus] = useState('idle');
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    setStatus('sending');
    try {
      // Con adjunto: se manda el formulario entero, no los campos sueltos.
      await submitNetlifyFormConArchivos(FORM_NAME, form);
      setStatus('success');
      // Igual que en los otros formularios: se cuenta el envío, nunca el
      // contenido de lo que la persona escribió.
      trackEvent('form-sumate-enviado');
      form.reset();
      setInstancia('');
      setFormKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="postulacion" className="bg-bone border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start"
      >
        <motion.div variants={fadeUp} transition={sectionTransition}>
          <span className="eyebrow text-accent">{POSTULACION.antetitulo}</span>
          <h2 className="font-serif text-[38px] md:text-[52px] leading-[1.08] tracking-[-0.025em] text-graphite mt-5 mb-6 font-normal">
            {POSTULACION.titulo}
          </h2>
          <p className="text-[16px] leading-[1.65] text-graphite max-w-[440px] m-0">
            {POSTULACION.bajada}
          </p>
          <p className="mt-4 text-[15px] leading-[1.65] text-graphite max-w-[440px] m-0">
            {POSTULACION.promesa}
          </p>
          <p className="mt-10 pt-6 border-t border-linen text-[13px] leading-[1.6] text-taupe max-w-[440px] m-0">
            {POSTULACION.nota}{' '}
            <a
              href={`mailto:${POSTULACION.mailCv}?subject=${encodeURIComponent('Postulación')}`}
              className="underline underline-offset-2 hover:text-accent transition-colors"
            >
              {POSTULACION.mailCv}
            </a>
            .
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          transition={sectionTransition}
          name={FORM_NAME}
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          onInput={reactivarAlEscribir(status, setStatus)}
          className="bg-parchment border border-linen p-8 md:p-10 flex flex-col gap-5"
        >
          <input type="hidden" name="form-name" value={FORM_NAME} />
          <p className="hidden">
            <label>
              No completar: <input name="bot-field" />
            </label>
          </p>

          <label className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">Nombre y apellido</span>
            <input type="text" name="nombre" required placeholder="—" className={inputCls} />
          </label>

          <div className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">Instancia de tu formación</span>
            <div className="relative">
              <select
                name="instancia"
                required
                value={instancia}
                onChange={(e) => setInstancia(e.target.value)}
                className={`${inputCls} appearance-none w-full pr-8 cursor-pointer`}
                style={{ opacity: instancia ? 1 : 0.4 }}
              >
                <option value="" disabled>
                  —
                </option>
                {INSTANCIAS.map((o) => (
                  <option key={o} value={o} style={{ opacity: 1 }}>
                    {o}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-taupe text-[14px]"
              >
                ▾
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">Mail</span>
            <CampoMail key={'mail-' + formKey} required className={inputCls} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">Teléfono</span>
            <CampoTelefono key={'tel-' + formKey} className={inputCls} />
          </div>

          <label className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">Tu CV</span>
            <input
              type="file"
              name="cv"
              accept=".pdf,.doc,.docx"
              className="text-[14px] text-graphite file:mr-4 file:py-2.5 file:px-4 file:border file:border-graphite file:bg-transparent file:text-graphite file:text-[13px] file:font-medium file:cursor-pointer hover:file:bg-bone file:transition-colors"
            />
            <span className="text-[12.5px] leading-[1.5] text-taupe">
              PDF o Word, hasta 8 MB. Opcional, pero nos ayuda a leerte mejor.
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">Contanos brevemente</span>
            <textarea
              name="mensaje"
              rows={3}
              placeholder="—"
              className={`${inputCls} resize-none leading-[1.5]`}
            />
          </label>

          <button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className="mt-2 self-start bg-accent text-bone rounded-full px-7 py-4 text-[14px] font-medium tracking-[-0.005em] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-cta disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {status === 'sending'
              ? BOTON.enviando
              : status === 'success'
                ? BOTON.enviado
                : 'Enviar postulación →'}
          </button>

          {status === 'success' && (
            <p className="text-[14px] leading-[1.6] text-graphite m-0" role="status">
              {MENSAJES_SUMATE.exito}
            </p>
          )}
          {status === 'error' && (
            <p className="text-[14px] leading-[1.6] text-accent m-0" role="alert">
              {MENSAJES_SUMATE.error}
            </p>
          )}
        </motion.form>
      </motion.div>
    </section>
  );
}
