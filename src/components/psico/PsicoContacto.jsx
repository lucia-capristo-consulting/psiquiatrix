import { useState } from 'react';
import CampoTelefono from '../CampoTelefono';
import CampoMail from '../CampoMail';
import { inputCls } from '../../lib/formulario';
import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../../motion';
import { submitNetlifyForm } from '../../lib/netlifyForm';
import { trackEvent } from '../../lib/analytics';

const FORM_NAME = 'contacto-psicologos';

function LockGlyph({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block flex-shrink-0"
      aria-hidden
    >
      <rect x="4" y="11" width="16" height="10" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

const REFERRAL_OPTIONS = [
  'Redes sociales',
  'Recomendación',
  'Búsqueda en Google',
  'Eventos y congresos',
  'Otros',
];

function Field({ label, htmlFor, children }) {
  return (
    <label className="flex flex-col gap-2" htmlFor={htmlFor}>
      <span className="eyebrow text-taupe">{label}</span>
      {children}
    </label>
  );
}

// Para campos con más de un input adentro: un <label> se asociaría solo al
// primero. El título va como texto suelto y cada input trae su propio
// aria-label desde su componente.
function Grupo({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow text-taupe">{label}</span>
      {children}
    </div>
  );
}

export default function PsicoContacto() {
  const [referral, setReferral] = useState('');
  const [intent, setIntent] = useState('Sí');
  const [status, setStatus] = useState('idle');
  // form.reset() no limpia los campos que manejan su propio estado (teléfono y
  // mail): cambiarles la key los vuelve a montar vacíos.
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    setStatus('sending');
    try {
      await submitNetlifyForm(FORM_NAME, data);
      setStatus('success');
      // Igual que en el form de pacientes: se cuenta el envío exitoso, sin
      // ningún dato de lo que la persona escribió.
      trackEvent('form-psicologos-enviado');
      form.reset();
      setReferral('');
      setIntent('Sí');
      setFormKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="derivacion" className="bg-bone border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start"
      >
        <motion.div variants={fadeUp} transition={sectionTransition}>
          <span className="eyebrow text-accent !font-bold tracking-[0.26em]">
            Contacto profesional
          </span>
          <h2 className="font-serif text-[44px] md:text-[56px] lg:text-[60px] leading-[1.05] tracking-[-0.025em] text-graphite mt-6 mb-6 m-0 font-normal">
            Construyamos una
            <br />
            <span className="italic text-accent">red de trabajo confiable.</span>
          </h2>
          <p className="text-[15.5px] leading-[1.65] text-graphite max-w-[460px] m-0">
            Si querés conocer cómo trabajamos, derivar un paciente o explorar
            una posible articulación profesional, podés escribirnos acá.
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          transition={sectionTransition}
          name={FORM_NAME}
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="bg-parchment border border-linen p-8 md:p-10 flex flex-col gap-6"
        >
          {/* Required for Netlify Forms in SPAs */}
          <input type="hidden" name="form-name" value={FORM_NAME} />
          <p className="hidden">
            <label>
              No completar: <input name="bot-field" />
            </label>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Nombre y apellido">
              <input type="text" name="nombre" required placeholder="—" className={inputCls} />
            </Field>
            <Field label="Profesión">
              <input
                type="text"
                name="profesion"
                placeholder="Psicólogo/a"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Grupo label="Teléfono">
              <CampoTelefono key={'tel-' + formKey} className={inputCls} />
            </Grupo>
            <Grupo label="Mail">
              <CampoMail key={'mail-' + formKey} required className={inputCls} />
            </Grupo>
          </div>

          <Field label="¿Cómo nos conociste?">
            <div className="relative">
              <select
                name="conocimiento"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                className={`${inputCls} appearance-none w-full pr-8 cursor-pointer`}
                style={{ opacity: referral ? 1 : 0.4 }}
              >
                <option value="" disabled>
                  —
                </option>
                {REFERRAL_OPTIONS.map((o) => (
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
          </Field>

          <div className="flex flex-col gap-2.5">
            <span className="eyebrow text-taupe">
              ¿Querés derivar un paciente actualmente?
            </span>
            <input type="hidden" name="intencion" value={intent} />
            <div className="flex gap-2.5 flex-wrap">
              {['Sí', 'No, quiero conocer más sobre cómo trabajan'].map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setIntent(o)}
                  aria-pressed={intent === o}
                  className={`px-4 py-2.5 border border-graphite rounded-full text-[13px] transition-all ${
                    intent === o
                      ? 'bg-bone text-graphite shadow-card'
                      : 'bg-transparent text-graphite hover:bg-bone/60'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <Field label="Mensaje breve">
            <textarea
              name="mensaje"
              rows={2}
              placeholder="—"
              className={`${inputCls} resize-none leading-[1.5]`}
            />
          </Field>

          <button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className="mt-2 self-start bg-accent text-bone rounded-full px-7 py-4 text-[14px] font-medium tracking-[-0.005em] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-cta disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {status === 'sending'
              ? 'Enviando…'
              : status === 'success'
                ? 'Enviado'
                : 'Enviar consulta profesional →'}
          </button>

          {status === 'success' && (
            <p className="text-[14px] leading-[1.6] text-graphite m-0" role="status">
              Recibimos tu mensaje. Te escribimos a la brevedad para coordinar una
              primera conversación. Te enviamos una confirmación por correo.
            </p>
          )}
          {status === 'error' && (
            <p className="text-[13px] text-accent m-0" role="alert">
              No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.
            </p>
          )}

          <p className="text-[12px] text-taupe m-0 inline-flex items-center justify-center gap-1.5 self-center">
            <LockGlyph size={12} />
            <span>Tu información es tratada con absoluta confidencialidad.</span>
          </p>
        </motion.form>
      </motion.div>
    </section>
  );
}
