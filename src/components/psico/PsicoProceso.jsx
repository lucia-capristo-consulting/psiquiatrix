import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../../motion';

const steps = [
  {
    n: '01',
    t: 'Nos contactás y nos das contexto',
    b: 'Nos contás brevemente la situación del paciente, el motivo de derivación y cualquier información clínica relevante para evaluar si somos la opción adecuada.',
  },
  {
    n: '02',
    t: 'Coordinamos la primera entrevista',
    b: 'Nos ocupamos del contacto inicial, la organización del turno y el encuadre necesario para comenzar el proceso de forma clara y cuidada.',
  },
  {
    n: '03',
    t: 'Sostenemos el tratamiento',
    b: 'Acompañamos el seguimiento psiquiátrico y mantenemos articulación profesional cuando el caso lo requiere.',
  },
];

export default function PsicoProceso() {
  return (
    <section id="como-derivar" className="bg-bone border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28"
      >
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 md:gap-14 mb-16 lg:mb-20"
        >
          <div>
            <span className="eyebrow text-accent !font-bold tracking-[0.26em]">
              El proceso
            </span>
            <h2 className="font-serif text-[44px] md:text-[56px] lg:text-[60px] leading-none tracking-[-0.025em] text-graphite mt-5 m-0 font-normal">
              Cómo <span className="italic text-accent">derivar.</span>
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-0"
        >
          <div className="hidden md:block absolute top-2 left-0 right-0 h-px bg-linen" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              variants={fadeUp}
              transition={sectionTransition}
              className="relative pr-8"
            >
              <div
                className={`w-3 h-3 rounded-full mt-0 mb-7 relative z-10 ${
                  i === 0
                    ? 'bg-accent'
                    : 'bg-bone border border-linen'
                }`}
              />
              <div className="font-serif italic text-[56px] md:text-[64px] text-accent leading-none tracking-[-0.015em] mb-4">
                {s.n}
              </div>
              <div className="font-serif text-[22px] md:text-[24px] leading-[1.2] tracking-[-0.012em] text-graphite mb-4">
                {s.t}
              </div>
              <p className="text-[13.5px] leading-[1.65] text-taupe m-0">
                {s.b}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
