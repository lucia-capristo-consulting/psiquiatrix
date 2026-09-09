import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../../motion';
import { directors } from '../../contenido/bios-directoras';
import BioBody from '../BioBody';
import { Link } from 'react-router-dom';
import { DIRECCION, TRABAJO, COMIENZO, PERFIL, NO_ES, SITIO } from '../../contenido/sumate';
import Frase from './Frase';

/**
 * Bloque de lista con antetítulo y título. Las tres secciones de la página
 * tienen la misma forma —enunciado y puntos— así que comparten componente:
 * lo que cambia entre ellas es el contenido, no la estructura.
 */
function Lista({ antetitulo, titulo, intro, puntos, cierre, fondo }) {
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
            <Frase texto={titulo} />
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
          {cierre && (
            <motion.p
              variants={fadeUp}
              transition={sectionTransition}
              className="text-[15.5px] leading-[1.7] text-graphite m-0 max-w-[560px] pt-2"
            >
              {cierre}
            </motion.p>
          )}
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

export function SumateComienzo() {
  return (
    <Lista
      antetitulo={COMIENZO.antetitulo}
      titulo={COMIENZO.titulo}
      puntos={COMIENZO.puntos}
      fondo="bg-bone"
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
      cierre={PERFIL.cierre}
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
    <section className="bg-parchment border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-20 lg:py-24"
      >
        <motion.div variants={fadeUp} transition={sectionTransition}>
          <span className="eyebrow text-accent">{DIRECCION.antetitulo}</span>
          <h2 className="font-serif text-[30px] md:text-[38px] leading-[1.12] tracking-[-0.02em] text-graphite mt-5 m-0 font-normal max-w-[760px]">
            <Frase texto={DIRECCION.titulo} />
          </h2>
          <div className="mt-6 flex flex-col gap-4 max-w-[620px]">
            {DIRECCION.parrafos.map((p) => (
              <p key={p} className="text-[15.5px] leading-[1.7] text-graphite m-0">
                {p}
              </p>
            ))}
          </div>

          <ul className="mt-8 flex flex-col gap-4 m-0 p-0 list-none max-w-[620px]">
            {DIRECCION.puntos.map((p) => (
              <li key={p} className="relative pl-6 text-[15.5px] leading-[1.7] text-graphite">
                <span aria-hidden className="absolute left-0 top-[3px] text-accent">
                  —
                </span>
                {p}
              </li>
            ))}
          </ul>

          {DIRECCION.cierre && (
            <p className="mt-8 text-[15.5px] leading-[1.7] text-graphite m-0 max-w-[620px] font-medium">
              {DIRECCION.cierre}
            </p>
          )}
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

/**
 * Cierre institucional: las dos páginas públicas del sitio.
 *
 * Va DESPUÉS del formulario a propósito. La página tiene un solo trabajo, que
 * es producir una postulación, y cualquier link puesto antes es una salida:
 * quien se va a mirar /psicologos en la mitad puede no volver. Acá funciona
 * como coda, y quien necesita verlo antes tiene el logo de la cabecera.
 */
export function SumateSitio() {
  return (
    <section className="bg-bone border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-16 lg:py-20"
      >
        <motion.div variants={fadeUp} transition={sectionTransition}>
          <span className="eyebrow text-accent">{SITIO.antetitulo}</span>
          <h2 className="font-serif text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.02em] text-graphite mt-5 m-0 font-normal max-w-[620px]">
            {SITIO.titulo}
          </h2>
        </motion.div>

        <motion.div
          variants={stagger(0.08)}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {SITIO.links.map((l) => (
            <motion.div key={l.a} variants={fadeUp} transition={sectionTransition}>
              <Link
                to={l.a}
                className="group flex items-center justify-between gap-6 border border-linen bg-parchment px-6 py-5 no-underline hover:border-accent transition-colors"
              >
                <span className="text-[15.5px] leading-[1.5] text-graphite">
                  {l.texto}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-accent text-[18px] leading-none transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
