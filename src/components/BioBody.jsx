import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const toParagraphs = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/**
 * Bio de una directora: el resumen (`intro`) siempre visible y el detalle
 * (`body`) plegado detrás de "Leer más".
 *
 * Se comparte entre Team.jsx (/) y psico/PsicoDirectoras.jsx (/psicologos)
 * para que las dos audiencias muestren exactamente el mismo texto. Los dos
 * textos salen de src/contenido/bios-directoras.js.
 */
export default function BioBody({ intro, body }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const id = useId();

  const resumen = toParagraphs(intro);
  const detalle = toParagraphs(body);

  return (
    <div>
      <div className="flex flex-col gap-3.5">
        {resumen.map((para, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'text-[14.5px] leading-[1.65] text-graphite font-medium m-0'
                : 'text-[14px] leading-[1.7] text-graphite font-normal m-0'
            }
          >
            {para}
          </p>
        ))}
      </div>

      {detalle.length > 0 && (
        <>
          {/* Los párrafos quedan siempre en el DOM (height 0 cuando está
              plegado) para que los buscadores lean la bio completa. */}
          <motion.div
            id={id}
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }
            }
            className="overflow-hidden"
            aria-hidden={!open}
          >
            <div className="pt-3.5 flex flex-col gap-3.5">
              {detalle.map((para, i) => (
                <p
                  key={i}
                  className="text-[14px] leading-[1.7] text-graphite font-normal m-0"
                >
                  {para}
                </p>
              ))}
            </div>
          </motion.div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={id}
            className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-accent hover:text-graphite transition-colors duration-300"
          >
            {open ? 'Ver menos' : 'Ver más'}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
