import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../motion';

const ejes = [
  {
    label: 'Eje clínico',
    body: (
      <>
        Diagnóstico, criterio médico,
        <br />
        supervisión y experiencia.
        <br />
        La solidez clínica como base de cada decisión.
      </>
    ),
  },
  {
    label: 'Eje humano',
    body: (
      <>
        Escucha, claridad,
        <br />
        continuidad y acompañamiento.
        <br />
        Entender lo que pasa también
        <br />
        forma parte del tratamiento.
      </>
    ),
  },
];

export default function SectionX() {
  return (
    <section className="relative overflow-hidden bg-parchment border-y border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.12)}
        className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-14 py-32 lg:py-40 text-center"
      >
        <motion.h2
          variants={fadeUp}
          transition={sectionTransition}
          className="font-serif text-[42px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-[-0.025em] text-graphite m-0 font-normal"
        >
          La <span className="italic text-accent">x</span> marca el cruce
          <br />
          entre <span className="italic">dos formas de cuidar</span>.
        </motion.h2>

        <motion.div
          variants={stagger(0.15)}
          className="relative mt-24 max-w-[1000px] mx-auto"
        >
          {/* Background X — centered to the eje grid */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          >
            <span
              className="font-serif italic text-accent leading-[0.8] inline-block"
              style={{
                fontSize: 'clamp(260px, 42vw, 560px)',
                transform: 'translateX(-0.06em)',
              }}
            >
              x
            </span>
          </motion.div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
            {ejes.map((e) => (
              <motion.div
                key={e.label}
                variants={fadeUp}
                transition={sectionTransition}
                className="px-6 md:px-12 text-center"
              >
                <div className="eyebrow text-accent mb-5 !font-bold !text-[12px] tracking-[0.28em]">
                  {e.label}
                </div>
                <div className="font-serif font-normal text-[22px] md:text-[24px] leading-[1.4] tracking-[-0.012em] text-graphite">
                  {e.body}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
