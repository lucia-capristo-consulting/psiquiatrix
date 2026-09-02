import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../../motion';
import { directors } from '../../data/directors';
import BioBody from '../BioBody';

const editorial = [
  <>
    Creamos Psiquiatrix después de
    más de 30 años de trabajo clínico y de compartir{' '}
    <span className="italic text-accent">una misma forma de ejercer la psiquiatría.</span>
  </>,
  <>
    Nos conocimos trabajando en el Instituto de Investigaciones Médicas Dr.
    Alfredo Lanari, donde construimos una mirada profesional basada en el
    criterio clínico, la escucha y el trabajo interdisciplinario.
  </>,
  <>
    Con el tiempo, empezamos a recibir más pacientes de los que podíamos
    atender personalmente. Así nació Psiquiatrix:
    como una forma de ampliar esa manera de trabajar, formando y acompañando a
    un equipo de psiquiatras que comparten esos mismos valores.
  </>,
  <>
    Hoy seguimos involucradas en los procesos importantes, coordinando ateneos
    clínicos, espacios de intercambio profesional y una red de trabajo
    construida sobre confianza real.
  </>,
];

const bios = directors;

export default function PsicoDirectoras() {
  return (
    <section id="quienes-somos" className="bg-bone border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28"
      >
        {/* Header */}
        <motion.div variants={fadeUp} transition={sectionTransition}>
          <span className="eyebrow text-accent !font-bold tracking-[0.26em]">
            Quiénes somos
          </span>
          <h2 className="font-serif text-[36px] md:text-[44px] lg:text-[48px] leading-[1.1] tracking-[-0.022em] text-graphite mt-5 m-0 font-normal max-w-[1000px]">
            Dirigido por psiquiatras con más de{' '}
            <span className="italic text-accent">
              30 años de experiencia clínica.
            </span>
          </h2>
          <p className="mt-4 font-serif italic text-[15px] md:text-[16px] text-taupe m-0">
            Por Claudia Heller y Amanda Villaverde
          </p>
        </motion.div>

        {/* Top grid: portrait + editorial */}
        <motion.div
          variants={stagger(0.12)}
          className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start"
        >
          <motion.figure
            variants={fadeUp}
            transition={sectionTransition}
            className="m-0"
          >
            <div className="overflow-hidden">
              <img
                src="/psico/directoras.jpg"
                alt="Dra. Claudia Heller y Dra. Amanda Villaverde, psiquiatras y co-fundadoras de PsiquiatriX"
                width="900"
                height="600"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
                style={{ filter: 'saturate(0.9) contrast(1.05)' }}
              />
            </div>
            <figcaption className="mt-4 mono-tag text-taupe">
              PSQX · DIRECCIÓN
            </figcaption>
          </motion.figure>

          <motion.div
            variants={stagger(0.08)}
            className="flex flex-col gap-5 max-w-[560px]"
          >
            {editorial.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                transition={sectionTransition}
                className={`m-0 ${
                  i === 0
                    ? 'font-serif font-normal text-[24px] md:text-[28px] leading-[1.3] tracking-[-0.012em] text-graphite'
                    : 'text-[15px] md:text-[15.5px] leading-[1.7] text-graphite font-normal'
                }`}
              >
                {p}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom: individual bios */}
        <motion.div
          variants={stagger(0.12)}
          className="mt-20 pt-14 border-t border-linen grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
        >
          {bios.map((b) => (
            <motion.div
              key={b.id}
              variants={fadeUp}
              transition={sectionTransition}
            >
              <div className="flex items-center gap-5">
                <div className="shrink-0 w-[96px] h-[120px] md:w-[112px] md:h-[140px] overflow-hidden">
                  <img
                    src={b.imgSm}
                    alt={`${b.name}, ${b.role.toLowerCase()} de PsiquiatriX`}
                    width="224"
                    height="280"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                    style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                  />
                </div>
                <div>
                  <h3 className="font-serif text-[26px] md:text-[28px] leading-[1.1] tracking-[-0.015em] text-graphite m-0 font-normal">
                    {b.name}
                  </h3>
                  <div className="mt-2 font-mono text-[11px] tracking-[0.08em] text-taupe">
                    {b.mn}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <BioBody intro={b.intro} body={b.body} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
