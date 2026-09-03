import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../motion';
import { submitNetlifyForm } from '../lib/netlifyForm';
import { trackEvent } from '../lib/analytics';
import { waUrl, WA_MESSAGES } from '../config/contact';
import CampoTelefono from './CampoTelefono';
import CampoMail from './CampoMail';
import { inputCls } from '../lib/formulario';

const FORM_NAME = 'contacto-pacientes';

const REFERRAL_OPTIONS = [
  'Redes sociales',
  'Recomendación',
  'Búsqueda en Google',
  'Eventos y congresos',
  'Otros',
];

const waLink = waUrl(WA_MESSAGES.paciente);

function WhatsappGlyph({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.45 1.66 6.32L3 29l6.86-1.62A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.7c-1.95 0-3.85-.5-5.52-1.46l-.4-.23-4.07.96.97-3.95-.26-.41A10.65 10.65 0 0 1 5.3 16C5.3 10.1 10.1 5.3 16 5.3S26.7 10.1 26.7 16 21.9 26.7 16 26.7zm6.13-7.96c-.34-.17-2-.99-2.31-1.1-.31-.11-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.26-.74.09-.34-.17-1.43-.53-2.72-1.68-1-.9-1.68-2-1.88-2.34-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.06-2.55-.28-.67-.56-.58-.77-.59l-.66-.01c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.86 5.18.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2-.82 2.29-1.61.28-.79.28-1.47.2-1.61-.09-.14-.31-.23-.65-.4z" />
    </svg>
  );
}

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

export default function CTA() {
  const [audience, setAudience] = useState('Para mí');
  const [referral, setReferral] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
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
      // Sólo se cuenta el envío exitoso, no el clic en el botón: lo que importa
      // medir es la consulta que llegó, no la intención. Sin datos del form.
      trackEvent('form-pacientes-enviado');
      form.reset();
      setReferral('');
      setFormKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contacto" className="bg-bone">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        <motion.div variants={fadeUp} transition={sectionTransition}>
          <span className="eyebrow text-accent">Contacto</span>
          <h2 className="font-serif text-[56px] md:text-[76px] lg:text-[88px] leading-[0.98] tracking-[-0.028em] text-graphite mt-6 mb-6 font-normal">
            Demos el<br />
            <span className="italic text-accent">primer paso.</span>
          </h2>
          <p className="text-[16px] leading-[1.65] text-graphite max-w-[460px]">
            Completá tus datos. Una profesional del equipo te va a contactar
            para evaluar si nuestro servicio es el indicado y coordinar los
            próximos pasos.
          </p>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="whatsapp-contacto"
            className="group mt-8 inline-flex w-fit items-center gap-3 pl-2.5 pr-4 py-2.5 bg-parchment border border-linen rounded-full no-underline transition-all duration-300 hover:border-accent/50"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent flex-shrink-0">
              <WhatsappGlyph size={20} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[12.5px] text-graphite">
                ¿Preferís escribirnos directamente?
              </span>
              <span className="text-[13.5px] font-medium text-accent mt-0.5 tracking-[-0.005em] transition-transform duration-200 group-hover:translate-x-0.5">
                Contactanos por WhatsApp →
              </span>
            </span>
          </a>
        </motion.div>

        <motion.form
          variants={fadeUp}
          transition={sectionTransition}
          name={FORM_NAME}
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="bg-parchment border border-linen p-8 md:p-10 flex flex-col gap-5"
        >
          {/* Required for Netlify Forms in SPAs */}
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
            <span className="eyebrow text-taupe">Teléfono</span>
            <CampoTelefono key={'tel-' + formKey} required className={inputCls} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">Email (opcional)</span>
            <CampoMail key={'mail-' + formKey} className={inputCls} />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="eyebrow text-taupe">¿Es para vos o para un familiar?</span>
            <input type="hidden" name="destinatario" value={audience} />
            <div className="flex gap-2.5 flex-wrap">
              {['Para mí', 'Para un familiar'].map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setAudience(o)}
                  aria-pressed={audience === o}
                  className={`px-4 py-2.5 border border-graphite rounded-full text-[13px] transition-all ${
                    audience === o
                      ? 'bg-bone text-graphite shadow-card'
                      : 'bg-transparent text-graphite hover:bg-bone/60'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">¿Cómo nos conociste? (opcional)</span>
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
          </div>

          <label className="flex flex-col gap-2">
            <span className="eyebrow text-taupe">Mensaje (opcional)</span>
            <textarea
              name="mensaje"
              rows={2}
              placeholder="—"
              className={`${inputCls} resize-none leading-[1.5]`}
            />
          </label>

          <button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className="mt-2 bg-accent text-bone rounded-full px-7 py-4 text-[14px] font-medium tracking-[-0.005em] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-cta disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {status === 'sending'
              ? 'Enviando…'
              : status === 'success'
                ? '¡Recibido!'
                : 'Quiero que me contacten →'}
          </button>

          {status === 'success' && (
            <p className="text-[13px] text-graphite m-0 text-center" role="status">
              Recibimos tus datos. Una profesional del equipo te va a contactar pronto.
            </p>
          )}
          {status === 'error' && (
            <p className="text-[13px] text-accent m-0 text-center" role="alert">
              No pudimos enviar tu mensaje. Probá de nuevo o escribinos por WhatsApp.
            </p>
          )}

          <p className="text-[11px] text-taupe text-center m-0 inline-flex items-center justify-center gap-1.5 self-center">
            <LockGlyph size={12} />
            <span>Tu información es tratada con absoluta confidencialidad</span>
          </p>
        </motion.form>
      </motion.div>
    </section>
  );
}
