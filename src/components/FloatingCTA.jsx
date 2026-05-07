import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const WA_NUMBER = '5491100000000';

const WA_MESSAGE_PACIENTE =
  'Hola, quisiera recibir información sobre una primera consulta en Psiquiatrix. Me gustaría saber si su atención se adapta a mi situación y cómo coordinar los próximos pasos.';

const WA_MESSAGE_PSICO =
  'Hola, soy psicólogo/a y quería consultar sobre derivaciones a Psiquiatrix. Me gustaría conocer más sobre cómo trabajan y coordinar una primera conversación profesional.';

function WhatsappGlyph({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.45 1.66 6.32L3 29l6.86-1.62A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.7c-1.95 0-3.85-.5-5.52-1.46l-.4-.23-4.07.96.97-3.95-.26-.41A10.65 10.65 0 0 1 5.3 16C5.3 10.1 10.1 5.3 16 5.3S26.7 10.1 26.7 16 21.9 26.7 16 26.7zm6.13-7.96c-.34-.17-2-.99-2.31-1.1-.31-.11-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.26-.74.09-.34-.17-1.43-.53-2.72-1.68-1-.9-1.68-2-1.88-2.34-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.06-2.55-.28-.67-.56-.58-.77-.59l-.66-.01c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.86 5.18.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2-.82 2.29-1.61.28-.79.28-1.47.2-1.61-.09-.14-.31-.23-.65-.4z" />
    </svg>
  );
}

export default function FloatingCTA() {
  const { pathname } = useLocation();
  const isPsico = pathname.startsWith('/psicologos');

  const message = isPsico ? WA_MESSAGE_PSICO : WA_MESSAGE_PACIENTE;
  const ariaLabel = isPsico
    ? 'Conversar sobre derivaciones por WhatsApp'
    : 'Coordinar primera consulta por WhatsApp';
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={ariaLabel}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-7 right-7 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white no-underline shadow-[0_8px_22px_rgba(20,18,14,0.18)] hover:shadow-[0_14px_36px_rgba(37,211,102,0.45)] transition-shadow duration-200"
    >
      <WhatsappGlyph size={30} />
    </motion.a>
  );
}
