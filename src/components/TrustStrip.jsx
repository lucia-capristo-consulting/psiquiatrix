import { motion } from 'framer-motion';
import { fadeUp, sectionTransition, inViewProps } from '../motion';

const items = [
  { t: 'Experiencia clínica', i: 'M4 12h16M4 6h16M4 18h16' },
  { t: 'Ateneo clínico semanal', i: 'M4 7h16M4 12h16M4 17h10' },
  { t: 'Coordinación con tu psicólogo/a', i: 'M5 12h14M12 5v14' },
  { t: 'Continuidad y seguimiento real', i: 'M12 6v6l4 2' },
];

function Glyph({ d }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export default function TrustStrip() {
  return (
    <motion.div
      {...inViewProps}
      variants={fadeUp}
      transition={sectionTransition}
      className="bg-parchment border-y border-linen"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-14 py-6 flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between items-start lg:items-center">
        <span className="eyebrow text-accent">Psiquiatría con respaldo</span>
        <div className="flex flex-wrap gap-x-9 gap-y-3 items-center text-[12px] font-medium text-graphite">
          {items.map(({ t, i }) => (
            <span key={t} className="flex items-center gap-2.5">
              <Glyph d={i} />
              <span>{t}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
