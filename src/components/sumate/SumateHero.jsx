import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../../motion';
import { HERO, ESTADO, BUSQUEDA_ABIERTA } from '../../contenido/sumate';

/**
 * El cartel de estado es lo que vuelve permanente a esta página. Cuando se
 * cubren los puestos no hay que despublicarla: se cambia BUSQUEDA_ABIERTA a
 * false en src/contenido/sumate.js y sigue en pie, recibiendo candidaturas
 * espontáneas, en vez de quedar desactualizada.
 */
export default function SumateHero() {
  const [antes, resaltado, despues] = HERO.titulo;

  return (
    <section className="bg-bone border-b border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 pt-24 pb-20 lg:pt-32 lg:pb-24"
      >
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-6 h-px bg-accent" />
          <span className="eyebrow text-accent">{HERO.antetitulo}</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={sectionTransition}
          className="font-serif text-[44px] md:text-[60px] lg:text-[68px] leading-[1.05] tracking-[-0.028em] text-graphite font-normal m-0 max-w-[960px]"
        >
          {antes}
          <span className="italic text-accent">{resaltado}</span>
          {despues}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={sectionTransition}
          className="mt-8 max-w-[620px] text-[16px] md:text-[17px] leading-[1.65] text-graphite m-0"
        >
          {HERO.bajada}
        </motion.p>

        <motion.div variants={fadeUp} transition={sectionTransition} className="mt-10">
          <span
            className={`inline-flex items-center gap-2.5 border px-4 py-2.5 mono-tag uppercase ${
              BUSQUEDA_ABIERTA
                ? 'border-accent text-accent'
                : 'border-linen text-taupe'
            }`}
          >
            <span
              aria-hidden
              className={`w-[7px] h-[7px] rounded-full ${
                BUSQUEDA_ABIERTA ? 'bg-accent' : 'bg-mute'
              }`}
            />
            {BUSQUEDA_ABIERTA ? ESTADO.abierta : ESTADO.cerrada}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
