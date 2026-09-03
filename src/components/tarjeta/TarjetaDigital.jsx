import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeUp, stagger, sectionTransition } from '../../motion';
import { directors } from '../../contenido/bios-directoras';
import { waUrl } from '../../contenido/contacto-whatsapp';
import BioBody from '../BioBody';

/**
 * Tarjeta digital de una directora, la pagina a la que lleva el QR que ella
 * muestra en el celular.
 *
 * Esta pensada para leerse en un telefono y de parada: alguien acaba de
 * escanear, esta con el celular en la mano y quiere hacer UNA cosa. Por eso
 * "Guardar contacto" ocupa todo el ancho y esta arriba de todo lo demas: es lo
 * que la mayoria va a querer, y no tiene que buscarlo.
 *
 * Los datos salen de src/contenido/tarjetas.js y la bio de bios-directoras.js,
 * la misma que usa el resto del sitio.
 */

function Icono({ children }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function IconoWhatsapp() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.45 1.66 6.32L3 29l6.86-1.62A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.7c-1.95 0-3.85-.5-5.52-1.46l-.4-.23-4.07.96.97-3.95-.26-.41A10.65 10.65 0 0 1 5.3 16C5.3 10.1 10.1 5.3 16 5.3S26.7 10.1 26.7 16 21.9 26.7 16 26.7zm6.13-7.96c-.34-.17-2-.99-2.31-1.1-.31-.11-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.26-.74.09-.34-.17-1.43-.53-2.72-1.68-1-.9-1.68-2-1.88-2.34-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.06-2.55-.28-.67-.56-.58-.77-.59l-.66-.01c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.86 5.18.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2-.82 2.29-1.61.28-.79.28-1.47.2-1.61-.09-.14-.31-.23-.65-.4z" />
    </svg>
  );
}

const ICONOS = {
  telefono: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2.1z" />
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M3 6.5l9 6 9-6" />
    </>
  ),
  contacto: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M5.5 16.2c.7-1.4 2-2.2 3.5-2.2s2.8.8 3.5 2.2M15.5 10h3.5M15.5 13.5h3.5" />
    </>
  ),
};

function AccionRapida({ href, etiqueta, icono, hijo, externo }) {
  return (
    <a
      href={href}
      aria-label={etiqueta}
      title={etiqueta}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex items-center justify-center h-14 rounded-2xl bg-parchment text-accent border border-linen transition-colors duration-200 hover:bg-linen"
    >
      {hijo || <Icono>{icono}</Icono>}
    </a>
  );
}

export default function TarjetaDigital({ tarjeta }) {
  const bio = directors.find((d) => d.id === tarjeta.bioId);
  const { contacto } = tarjeta;

  const mensajeWa = `Hola ${tarjeta.nombre.split(' ')[0]}, te escribo desde tu tarjeta de contacto.`;

  return (
    <div className="bg-bone text-graphite min-h-screen">
      <div className="mx-auto w-full max-w-[520px]">
        {/* Foto. La curva de abajo la dibuja un SVG y no un border-radius:
            asi el corte es concavo, como en el diseno, y no una esquina
            redondeada. */}
        <div className="relative">
          <img
            src={tarjeta.foto}
            alt={`${tarjeta.nombre}, ${tarjeta.titulo.toLowerCase()}`}
            width="1023"
            height="920"
            className="w-full h-[46vh] max-h-[420px] min-h-[280px] object-cover object-top"
          />
          <svg
            className="absolute bottom-[-1px] left-0 w-full"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d="M0 12 Q50 -2 100 12 L100 12 L0 12 Z" fill="#F2EDE4" />
          </svg>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger(0.07)}
          className="px-7 pb-16 -mt-2"
        >
          <motion.h1
            variants={fadeUp}
            transition={sectionTransition}
            className="font-serif text-[42px] leading-[1.05] tracking-[-0.025em] font-normal m-0"
          >
            {tarjeta.nombre}
          </motion.h1>

          <motion.div variants={fadeUp} transition={sectionTransition}>
            <span className="block w-12 h-[2px] bg-accent my-5" />
            <p className="font-serif text-[22px] leading-[1.2] text-accent m-0">
              {tarjeta.titulo}
            </p>
            <p className="mt-2 text-[15px] leading-[1.5] text-graphite font-medium m-0">
              {tarjeta.rol}
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.6] text-taupe m-0">
              {tarjeta.presentacion}
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.08em] text-taupe m-0">
              {tarjeta.matricula}
            </p>
          </motion.div>

          {/* La accion principal, sola y a todo el ancho. */}
          <motion.a
            variants={fadeUp}
            transition={sectionTransition}
            href={tarjeta.vcard}
            download
            className="mt-7 flex items-center justify-center gap-3 h-16 rounded-2xl bg-accent text-bone text-[16px] font-medium no-underline transition-transform duration-200 active:scale-[0.98]"
          >
            <Icono>{ICONOS.contacto}</Icono>
            Guardar contacto
          </motion.a>

          <motion.div
            variants={fadeUp}
            transition={sectionTransition}
            className="mt-3 grid grid-cols-4 gap-3"
          >
            <AccionRapida
              href={waUrl(mensajeWa)}
              etiqueta={`Escribir a ${tarjeta.nombre} por WhatsApp`}
              hijo={<IconoWhatsapp />}
              externo
            />
            <AccionRapida
              href={`tel:${contacto.telefono.replace(/[^\d+]/g, '')}`}
              etiqueta={`Llamar a ${tarjeta.nombre}`}
              icono={ICONOS.telefono}
            />
            <AccionRapida href="/" etiqueta="Ir al sitio de PsiquiatriX" icono={ICONOS.web} />
            <AccionRapida
              href={`mailto:${contacto.mail}`}
              etiqueta={`Escribir a ${tarjeta.nombre} por mail`}
              icono={ICONOS.mail}
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={sectionTransition}
            className="mt-10 pt-8 border-t border-linen"
          >
            <h2 className="font-serif text-[26px] leading-[1.15] tracking-[-0.015em] font-normal m-0">
              Sobre {tarjeta.nombre.split(' ')[0]}
            </h2>
            <div className="mt-4">
              <BioBody
                intro={[tarjeta.sobre]}
                body={bio ? [...bio.intro, ...bio.body] : []}
                textoAbrir="Conocer su trayectoria"
                textoCerrar="Ver menos"
              />
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={sectionTransition}
            className="mt-12 pt-8 border-t border-linen text-center"
          >
            <Link
              to="/"
              className="font-serif text-[26px] tracking-[-0.015em] text-graphite no-underline"
            >
              Psiquiatri<span className="italic text-accent">x</span>
            </Link>
            <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-taupe m-0">
              WWW.PSIQUIATRIX.AR
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
