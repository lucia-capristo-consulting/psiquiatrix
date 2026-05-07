import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../motion';

const items = [
  {
    k: '01',
    t: 'Criterio clínico',
    b: ['Diagnóstico riguroso.', 'Criterio médico sólido.', 'Tratamiento personalizado.'],
  },
  {
    k: '02',
    t: 'Respaldo clínico',
    b: [
      'Ateneos clínicos semanales y respaldo profesional continuo.',
      'Cada profesional trabaja con autonomía, sabiendo que cuenta con un equipo de consulta y supervisión cuando el caso lo requiere.',
    ],
  },
  {
    k: '03',
    t: 'Cercanía profesional',
    b: ['Trato humano sin perder profundidad clínica.', 'Espacios de escucha, sin apuro y sin juicio.'],
  },
  {
    k: '04',
    t: 'Integración terapéutica',
    b: ['Coordinación real con psicólogos y otros profesionales cuando el tratamiento lo necesita.'],
  },
  {
    k: '05',
    t: 'Claridad y confianza',
    b: ['El paciente entiende su tratamiento:', 'qué hace cada medicación, qué esperar y cuándo revisar.'],
  },
];

export default function Pillars() {
  return (
    <section className="bg-parchment border-b border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.08)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28"
      >
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-14 gap-6"
        >
          <div>
            <span className="eyebrow text-accent !font-bold tracking-[0.26em]">
              Nuestros pilares
            </span>
            <h2 className="font-serif text-[40px] md:text-[52px] lg:text-[60px] leading-none tracking-[-0.025em] text-graphite mt-6 max-w-[880px] font-normal">
              <span className="italic text-accent">Una clínica digital</span>, no
              <br />
              una plataforma de profesionales aislados.
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={stagger(0.08)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-linen border border-linen"
        >
          {items.map((it) => (
            <motion.div
              key={it.k}
              variants={fadeUp}
              transition={sectionTransition}
              whileHover={{ y: -4 }}
              className="bg-bone p-7 flex flex-col gap-4 min-h-[280px] transition-shadow duration-300 hover:shadow-card"
            >
              <div className="font-serif italic text-[38px] text-accent leading-none">
                {it.k}
              </div>
              <div className="font-serif text-[22px] leading-[1.15] tracking-[-0.01em] text-graphite">
                {it.t}
              </div>
              <div className="text-[13px] leading-[1.6] text-graphite space-y-1">
                {it.b.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
