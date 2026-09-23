import { motion } from 'framer-motion';
import { fadeUp, stagger, sectionTransition, inViewProps } from '../motion';

// Los cortes de renglón están puestos a mano. Newsreader es más ancha que
// Instrument Serif y "de cada decisión." quedaba partida sola: con el corte
// extra los dos ejes quedan en 4 renglones, en escritorio y en celular.
const ejes = [
  {
    label: 'Eje clínico',
    body: (
      <>
        Diagnóstico, criterio médico,
        <br />
        respaldo y experiencia.
        <br />
        La solidez clínica como base
        <br />
        de cada decisión.
      </>
    ),
  },
  {
    label: 'Eje humano',
    body: (
      <>
        Escucha, claridad,
        <br />
        continuidad y acompañamiento.
        <br />
        Entender lo que pasa también
        <br />
        forma parte del tratamiento.
      </>
    ),
  },
];

export default function SectionX() {
  return (
    <section className="relative overflow-hidden bg-parchment border-y border-linen">
      <motion.div
        {...inViewProps}
        variants={stagger(0.12)}
        className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-14 py-32 lg:py-40 text-center"
      >
        <motion.h2
          variants={fadeUp}
          transition={sectionTransition}
          className="font-serif text-[42px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-[-0.025em] text-graphite m-0 font-normal"
        >
          La <span className="italic text-accent">x</span> marca el cruce
          <br />
          entre <span className="italic">dos formas de cuidar</span>.
        </motion.h2>

        <motion.div
          variants={stagger(0.15)}
          className="relative mt-24 max-w-[1000px] mx-auto"
        >
          {/* Background X — centrada entre los dos textos, no en la grilla.
              Lo que se mide es el trazo de la letra (su caja de tinta), no la
              caja tipográfica. Los dos ejes van centrados en sus columnas,
              pero el más ancho es el de la derecha, así que el punto medio
              entre los dos textos cae unos píxeles a la izquierda del centro
              de la grilla: de ahí el -0.008em.
              Medido con Newsreader (23/09): desde 1280px de ancho los dos
              textos quedan a ~100px del centro de la x, con 1px de diferencia
              como mucho. En tablet (768–1023px) los ejes se parten solos en
              renglones más cortos y la x queda ~20px corrida hacia el texto
              de la izquierda; en celular es una sola columna.
              Si cambia el texto de un eje, hay que volver a medirlo. */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          >
            <span
              className="font-serif italic text-accent leading-[0.8] inline-block"
              style={{
                fontSize: 'clamp(260px, 42vw, 560px)',
                transform: 'translateX(-0.008em)',
              }}
            >
              x
            </span>
          </motion.div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
            {ejes.map((e) => (
              <motion.div
                key={e.label}
                variants={fadeUp}
                transition={sectionTransition}
                className="px-6 md:px-12 text-center"
              >
                <div className="eyebrow text-accent mb-5 !font-bold !text-[12px] tracking-[0.28em]">
                  {e.label}
                </div>
                <div className="font-editorial font-normal text-[22px] md:text-[24px] leading-[1.25] tracking-[-0.005em] text-graphite">
                  {e.body}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
