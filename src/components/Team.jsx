import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../motion';
import { directors } from '../data/directors';

export default function Team() {
  return (
    <section id="quienes-somos" className="bg-parchment border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28"
      >
        <motion.div variants={fadeUp} transition={sectionTransition} className="mb-16">
          <div className="flex items-center gap-3.5 mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-accent" aria-hidden>
              <circle cx="9" cy="9" r="3" />
              <circle cx="17" cy="11" r="2.5" />
              <path d="M3 19c0-3 3-5 6-5s6 2 6 5M14 19c0-2 2-3.5 4-3.5s4 1.5 4 3.5" />
            </svg>
            <span className="eyebrow text-accent">Quiénes somos</span>
          </div>
          <h2 className="font-serif text-[40px] md:text-[52px] lg:text-[56px] leading-[1.05] tracking-[-0.025em] text-graphite m-0 max-w-[1000px] font-normal">
            Dirigido por psiquiatras con más de{' '}
            <span className="italic text-accent">30 años de experiencia clínica</span>.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-linen border border-linen"
        >
          {directors.map((p) => (
            <motion.article
              key={p.id}
              variants={fadeUp}
              transition={sectionTransition}
              whileHover={{ y: -6 }}
              className="group bg-bone p-8 md:p-10 flex flex-col cursor-pointer transition-all duration-300 hover:bg-bone hover:shadow-cardHover relative overflow-hidden"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-accent scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />

              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-6 md:gap-8 items-start">
                <div className="w-[140px] md:w-[200px] h-[180px] md:h-[240px] overflow-hidden">
                  <img
                    src={p.img}
                    alt={`${p.name}, ${p.role.toLowerCase()} de PsiquiatriX`}
                    width="400"
                    height="480"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                  />
                </div>
                <div>
                  <div className="eyebrow text-accent mb-2.5">{p.role}</div>
                  <div className="font-serif text-[26px] md:text-[30px] leading-[1.1] tracking-[-0.015em] text-graphite mb-2.5">
                    {p.name}
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.08em] text-taupe">
                    {p.mn}
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-7 border-t border-linen/80">
                <p className="text-[14.5px] leading-[1.65] text-graphite font-medium m-0">
                  {p.intro}
                </p>
                <div className="mt-4 flex flex-col gap-3.5">
                  {p.body.map((para, i) => (
                    <p
                      key={i}
                      className="text-[14px] leading-[1.7] text-graphite font-normal m-0"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="mt-20 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start"
        >
          <h3 className="font-serif text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-graphite m-0 font-normal">
            Un equipo seleccionado por{' '}
            <span className="italic text-accent">criterio clínico</span> y
            valores compartidos.
          </h3>
          <div className="text-[15.5px] leading-[1.7] text-graphite flex flex-col gap-4.5 space-y-4">
            <p className="m-0">
              Trabajamos con psiquiatras que comparten una misma forma de
              ejercer la profesión: escucha, criterio médico, responsabilidad
              clínica y trabajo en equipo.
            </p>
            <p className="m-0">
              Cada profesional cuenta con autonomía en su práctica y con el
              respaldo de una estructura de supervisión, ateneos y
              acompañamiento profesional continuo.
            </p>
            <p className="m-0">
              Cuando el tratamiento lo requiere, articulamos con otros
              profesionales de salud — psicólogos, neurólogos, médicos clínicos
              y otros especialistas — para acompañar cada proceso de forma
              integral.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
