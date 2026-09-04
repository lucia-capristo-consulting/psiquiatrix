import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../../motion';
import { directors } from '../../contenido/bios-directoras';
import BioBody from '../BioBody';
import { DIRECCION, TRABAJO, PERFIL, NO_ES } from '../../contenido/sumate';

/**
 * Bloque de lista con antetítulo y título. Las tres secciones de la página
 * tienen la misma forma —enunciado y puntos— así que comparten componente:
 * lo que cambia entre ellas es el contenido, no la estructura.
 */
function Lista({ antetitulo, titulo, intro, puntos, fondo }) {
  return (
    <section className={`${fondo} border-t border-linen`}>
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start"
      >
        <motion.div variants={fadeUp} transition={sectionTransition}>
          <span className="eyebrow text-accent">{antetitulo}</span>
          <h2 className="font-serif text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.02em] text-graphite mt-5 m-0 font-normal">
            {titulo}
          </h2>
        </motion.div>

        <motion.div variants={stagger(0.08)} className="flex flex-col gap-5">
          {intro && (
            <motion.p
              variants={fadeUp}
              transition={sectionTransition}
              className="text-[15.5px] leading-[1.7] text-graphite m-0 max-w-[560px]"
            >
              {intro}
            </motion.p>
          )}
          <ul className="flex flex-col gap-4 m-0 p-0 list-none">
            {puntos.map((p) => (
              <motion.li
                key={p}
                variants={fadeUp}
                transition={sectionTransition}
                className="relative pl-6 text-[15.5px] leading-[1.7] text-graphite max-w-[560px]"
              >
                <span aria-hidden className="absolute left-0 top-[3px] text-accent">
                  —
                </span>
                {p}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function SumateTrabajo() {
  return (
    <Lista
      antetitulo={TRABAJO.antetitulo}
      titulo={TRABAJO.titulo}
      puntos={TRABAJO.puntos}
      fondo="bg-parchment"
    />
  );
}

export function SumatePerfil() {
  return (
    <Lista
      antetitulo={PERFIL.antetitulo}
      titulo={PERFIL.titulo}
      intro={PERFIL.intro}
      puntos={PERFIL.requisitos}
      fondo="bg-bone"
    />
  );
}

export function SumateNoEs() {
  return (
    <Lista
      antetitulo={NO_ES.antetitulo}
      titulo={NO_ES.titulo}
      puntos={NO_ES.puntos}
      fondo="bg-parchment"
    />
  );
}

/**
 * La dirección clínica. Para quien está en formación, la trayectoria de las
 * dos no es un adorno de credibilidad: es aquello a lo que viene. Por eso va
 * la bio completa, la misma que usa el resto del sitio.
 */
export function SumateDireccion() {
  return (
    <section className="bg-bone border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-20 lg:py-24"
      >
        <motion.div variants={fadeUp} transition={sectionTransition}>
          <span className="eyebrow text-accent">Quiénes acompañan</span>
          <h2 className="font-serif text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.02em] text-graphite mt-5 m-0 font-normal max-w-[760px]">
            {DIRECCION.titulo}
          </h2>
          <div className="mt-6 flex flex-col gap-4 max-w-[620px]">
            {DIRECCION.parrafos.map((p) => (
              <p key={p} className="text-[15.5px] leading-[1.7] text-graphite m-0">
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          className="mt-14 pt-12 border-t border-linen grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
        >
          {directors.map((d) => (
            <motion.div key={d.id} variants={fadeUp} transition={sectionTransition}>
              <div className="flex items-center gap-5">
                <div className="shrink-0 w-[96px] h-[120px] overflow-hidden">
                  <img
                    src={d.imgSm}
                    alt={`${d.name}, ${d.role.toLowerCase()} de PsiquiatriX`}
                    width="224"
                    height="280"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                    style={{ filter: 'saturate(0.85) contrast(1.05)' }}
                  />
                </div>
                <div>
                  <h3 className="font-serif text-[24px] leading-[1.1] tracking-[-0.015em] text-graphite m-0 font-normal">
                    {d.name}
                  </h3>
                  <div className="mt-2 font-mono text-[11px] tracking-[0.08em] text-taupe">
                    {d.mn}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <BioBody intro={d.intro} body={d.body} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
