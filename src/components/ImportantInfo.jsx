import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../motion';

export default function ImportantInfo() {
  return (
    <section className="bg-bone border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-14 lg:py-16"
      >
        <motion.div
          variants={stagger(0.1)}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
        >
          {/* Col 1 — eyebrow only */}
          <motion.div
            variants={fadeUp}
            transition={sectionTransition}
            className="flex flex-col"
          >
            <div className="eyebrow text-accent !font-bold tracking-[0.26em]">
              Información importante
            </div>
          </motion.div>

          {/* Col 2 — Atendemos + Brindamos */}
          <motion.div
            variants={fadeUp}
            transition={sectionTransition}
            className="flex flex-col"
          >
            <span aria-hidden className="block w-6 h-px bg-accent mb-4" />
            <p className="text-[14.5px] md:text-[15px] leading-[1.55] text-graphite font-medium m-0">
              Atendemos exclusivamente a personas{' '}
              <strong className="font-semibold">mayores de 18 años</strong>.
            </p>
            <p className="text-[14.5px] md:text-[15px] leading-[1.55] text-graphite font-medium m-0 mt-3.5">
              Brindamos atención a pacientes de todo el mundo.
            </p>
          </motion.div>

          {/* Col 3 — Urgencias */}
          <motion.div
            variants={fadeUp}
            transition={sectionTransition}
            className="flex flex-col"
          >
            <span aria-hidden className="block w-6 h-px bg-accent mb-4" />
            <p className="text-[14.5px] md:text-[15px] leading-[1.55] text-graphite font-medium m-0">
              No atendemos urgencias psiquiátricas.
            </p>
            <p className="text-[13.5px] leading-[1.65] text-taupe font-normal mt-3.5 m-0">
              Si estás atravesando una situación de urgencia, te recomendamos
              acudir a una guardia médica o comunicarte con los servicios de
              asistencia inmediata de tu zona.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
