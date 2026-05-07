import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition } from '../../motion';

const HERO_IMG = '/psico/psico-hero.jpg';

export default function PsicoHero() {
  return (
    <section id="top" className="relative overflow-hidden bg-bone">
      <div className="absolute inset-0 -z-0">
        <img
          src={HERO_IMG}
          alt="Psicólogos derivadores — atención psiquiátrica online articulada con profesionales"
          width="1600"
          height="900"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'saturate(0.9) contrast(1.05)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(95deg, #F2EDE4F2 0%, #F2EDE4E0 38%, #F2EDE470 62%, transparent 100%)',
          }}
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-32"
        initial="hidden"
        animate="visible"
        variants={stagger(0.12)}
      >
        <div className="max-w-[760px]">
          <motion.div
            variants={fadeUp}
            transition={sectionTransition}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-6 h-px bg-accent" />
            <span className="eyebrow text-accent">
              Para psicólogos y profesionales derivadores
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={sectionTransition}
            className="font-serif text-[48px] md:text-[64px] lg:text-[72px] leading-[1.04] tracking-[-0.028em] text-graphite font-normal m-0"
          >
            Cuando derivás a Psiquiatri
            <span className="italic text-accent">x</span>,
            <br />
            <span className="italic text-accent">
              seguís en la conversación.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={sectionTransition}
            className="mt-8 max-w-[560px] text-[16px] md:text-[17px] leading-[1.6] text-graphite font-normal"
          >
            Atención psiquiátrica con criterio clínico, comunicación
            profesional clara y respeto por el proceso terapéutico que ya
            construiste con tu paciente.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={sectionTransition}
            className="mt-10"
          >
            <a
              href="#como-trabajamos"
              className="group inline-flex items-center gap-3 rounded-full bg-accent text-bone px-7 py-4 text-[14px] font-medium tracking-[-0.005em] shadow-cta transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span>Quiero conocer cómo trabajan</span>
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
