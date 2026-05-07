import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../motion';

const steps = [
  {
    n: '01',
    t: 'Nos contactás',
    b: 'Por formulario o WhatsApp. Sin procesos impersonales: primero escuchamos.',
  },
  {
    n: '02',
    t: 'Una profesional te llama',
    b: 'Evaluamos si Psiquiatrix es lo que tu situación necesita. Si no, también te orientamos.',
  },
  {
    n: '03',
    t: 'Primera consulta',
    b: 'Una entrevista de 60 minutos para conocer tu historia, tu contexto y construir una primera mirada clínica.',
  },
  {
    n: '04',
    t: 'Un tratamiento a tu medida',
    b: 'Definimos frecuencia de seguimiento, necesidad de medicación y articulación con otros profesionales según criterio clínico.',
  },
];

export default function Process() {
  return (
    <section id="recorrido" className="bg-bone">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28"
      >
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="flex flex-col md:flex-row md:justify-between md:items-end gap-10 md:gap-14 mb-16 lg:mb-20"
        >
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-accent" aria-hidden>
                <path d="M4 18c4 0 4-12 8-12s4 12 8 12" />
              </svg>
              <span className="eyebrow text-accent">El recorrido</span>
            </div>
            <h2 className="font-serif text-[44px] md:text-[56px] lg:text-[60px] leading-none tracking-[-0.025em] text-graphite m-0 font-normal">
              Cuatro pasos.
              <br />
              <span className="italic text-accent">Sin burocracia.</span>
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-0"
        >
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-linen" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              variants={fadeUp}
              transition={sectionTransition}
              className="relative pr-8"
            >
              <div
                className={`w-3 h-3 rounded-full mt-6 mb-7 relative z-10 ${
                  i === 0 ? 'bg-accent' : 'bg-bone border border-linen'
                }`}
              />
              <div className="font-serif italic text-[56px] text-accent leading-none tracking-[-0.015em] mb-3.5">
                {s.n}
              </div>
              <div className="font-serif text-[24px] leading-[1.15] tracking-[-0.01em] text-graphite mb-3.5">
                {s.t}
              </div>
              <p className="text-[13.5px] leading-[1.6] text-taupe">{s.b}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
