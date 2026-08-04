import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../../motion';

const items = [
  'Coordinación de turno cuidada',
  'Comunicación clínica clara',
  'La psiquiatría acompaña, no compite',
  'Criterio institucional compartido',
];

function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent flex-shrink-0"
      aria-hidden
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export default function PsicoIncertidumbre() {
  return (
    <section className="bg-bone border-t border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.1)}
        className="mx-auto max-w-[1280px] px-6 lg:px-14 py-24 lg:py-28"
      >
        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="eyebrow text-accent !font-bold tracking-[0.26em] mb-5"
        >
          Cómo trabajamos
        </motion.div>

        <motion.h2
          variants={fadeUp}
          transition={sectionTransition}
          className="font-serif text-[40px] md:text-[52px] lg:text-[60px] leading-[1.05] tracking-[-0.025em] text-graphite m-0 font-normal max-w-[1000px]"
        >
          Derivar no debería ser{' '}
          <span className="italic text-accent">una incertidumbre.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          transition={sectionTransition}
          className="mt-6 max-w-[640px] text-[15.5px] leading-[1.65] text-graphite font-normal"
        >
          Muchas derivaciones fallan no por falta de capacidad clínica, sino por
          comunicación, continuidad o criterio.{' '}
          <span className="italic text-accent">
            Psiquiatrix trabaja distinto.
          </span>
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={sectionTransition}
          className="mt-14 max-w-[720px] bg-parchment border border-linen px-7 md:px-10 py-9 md:py-11"
        >
          <motion.ul
            variants={stagger(0.08)}
            className="flex flex-col"
          >
            {items.map((it, i) => (
              <motion.li
                key={it}
                variants={fadeUp}
                transition={sectionTransition}
                className={`flex items-center gap-4 py-4 ${
                  i < items.length - 1 ? 'border-b border-linen/80' : ''
                }`}
              >
                <Check />
                <span className="font-serif text-[18px] md:text-[20px] leading-[1.3] tracking-[-0.01em] text-graphite">
                  {it}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
