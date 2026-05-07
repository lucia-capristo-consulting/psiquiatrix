import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition } from '../motion';

const HERO_IMG =
  'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1600&q=80';

function CtaCard({ title, sub, primary, href }) {
  return (
    <motion.a
      href={href}
      variants={fadeUp}
      transition={sectionTransition}
      whileHover={{ y: -4 }}
      className={`group flex-1 flex flex-col justify-between gap-7 rounded-[14px] px-6 py-6 min-h-[132px] border transition-shadow duration-300 ${
        primary
          ? 'bg-accent text-bone border-accent shadow-cta hover:shadow-[0_18px_40px_rgba(20,18,14,0.22)]'
          : 'bg-bone text-graphite border-black/10 shadow-card hover:shadow-[0_14px_32px_rgba(20,18,14,0.12)]'
      }`}
    >
      <div className="font-serif text-[22px] leading-[1.15] tracking-[-0.012em] max-w-[240px]">
        {title}
      </div>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`eyebrow ${primary ? 'text-bone/90' : 'text-taupe'}`}
        >
          {sub}
        </span>
        <span
          aria-hidden
          className={`text-lg transition-transform duration-200 group-hover:translate-x-1 ${
            primary ? 'text-bone' : 'text-accent'
          }`}
        >
          →
        </span>
      </div>
    </motion.a>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-bone">
      <div className="absolute inset-0 -z-0">
        <img
          src={HERO_IMG}
          alt="Consulta psiquiátrica online — escritorio clínico con luz cálida"
          width="1600"
          height="1067"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) contrast(1.05)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, #F2EDE4EE 0%, #F2EDE4D0 38%, #F2EDE440 70%, transparent 100%)',
          }}
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28 max-w-[820px]"
        initial="hidden"
        animate="visible"
        variants={stagger(0.12)}
      >
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-6 h-px bg-accent" />
          <span className="eyebrow text-accent">
            Centro de psiquiatría online
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={sectionTransition}
          className="font-serif text-[56px] md:text-[72px] lg:text-[80px] leading-[1.04] tracking-[-0.028em] text-graphite font-normal m-0"
        >
          Psiquiatría profesional
          <br />
          con <span className="italic text-accent">mirada humana.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={sectionTransition}
          className="mt-9 max-w-[560px] text-[17px] leading-[1.55] text-graphite font-normal"
        >
          Atención psiquiátrica online pensada para sostener tratamientos en el
          tiempo, con criterio clínico, seguimiento personalizado y una mirada
          integral de cada paciente.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="mt-10 flex flex-col sm:flex-row gap-3.5 items-stretch max-w-[640px]"
        >
          <CtaCard
            title="Agendá tu consulta"
            sub="Pacientes"
            primary
            href="#contacto"
          />
          <CtaCard
            title="Soy psicólogo/a — Quiero derivar"
            sub="Profesionales"
            href="/psicologos"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
