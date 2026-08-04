import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../motion';

const IMG =
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1200&q=80';

export default function Manifesto() {
  return (
    <section id="manifiesto" className="bg-bone border-b border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start"
      >
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="relative pt-14"
        >
          <div className="overflow-hidden">
            <img
              src={IMG}
              alt="Espacio sereno para atención psiquiátrica online — luz natural y silencio"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
              className="w-full h-[420px] object-cover"
              style={{ filter: 'saturate(0.85) contrast(1.05)' }}
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} transition={sectionTransition}>
          <div className="flex items-center gap-3.5 mb-7">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-accent" aria-hidden>
              <path d="M7 7h4v4c0 3-2 5-4 5M14 7h4v4c0 3-2 5-4 5" />
            </svg>
            <span className="eyebrow text-accent">Manifiesto</span>
          </div>
          <h2 className="font-serif text-[40px] md:text-[52px] lg:text-[56px] leading-[1.05] tracking-[-0.025em] text-graphite m-0 font-normal">
            La salud mental
            <br />
            requiere <span className="italic text-accent">tiempo</span>.
          </h2>
          <p className="font-serif text-[22px] md:text-[26px] leading-[1.3] tracking-[-0.012em] text-graphite mt-8 max-w-[560px] font-normal">
            Existimos porque demasiados pacientes encuentran una psiquiatría
            rápida, impersonal y fragmentada.
            <br />
            <span className="italic text-accent">Psiquiatrix trabaja de otra manera.</span>
          </p>
          <p className="text-[16px] leading-[1.65] text-graphite mt-7 max-w-[560px]">
            Somos una clínica digital con criterio institucional. Cada tratamiento se
            <br />
            acompaña con experiencia clínica, respaldo profesional y
            articulación con los profesionales que ya forman parte del proceso
            terapéutico.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
