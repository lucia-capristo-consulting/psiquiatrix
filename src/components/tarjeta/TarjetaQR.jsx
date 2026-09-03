import { Link } from 'react-router-dom';

/**
 * La pantalla que la profesional MUESTRA en su celular para que la escaneen.
 *
 * Es la contracara de TarjetaDigital: aquella la lee quien escanea, esta la
 * sostiene ella. De ahi las decisiones:
 *
 *  - Entra en una pantalla sin scrollear. Si hay que deslizar para encontrar el
 *    QR, la situacion se vuelve incomoda justo cuando tiene que ser fluida.
 *  - El QR va sobre BLANCO puro y no sobre el bone de la marca. En una pantalla
 *    con poco brillo cada punto de contraste cuenta, y el blanco es lo mas
 *    claro que puede mostrar un telefono.
 *  - Se le da tamano generoso: se escanea desde medio metro, muchas veces con
 *    una camara vieja y con reflejos encima.
 */
export default function TarjetaQR({ tarjeta }) {
  return (
    <div className="bg-bone text-graphite min-h-[100svh] flex flex-col">
      <div className="mx-auto w-full max-w-[460px] flex-1 flex flex-col items-center justify-center px-8 pt-10 pb-6 text-center">
        <h1 className="font-serif text-[40px] leading-[1.05] tracking-[-0.025em] font-normal m-0">
          {tarjeta.nombre}
        </h1>
        <p className="mt-3 text-[16px] text-accent m-0">{tarjeta.titulo}</p>
        <span className="block w-12 h-[2px] bg-accent mt-5 mb-8" />

        <div className="w-full bg-white rounded-[28px] p-5 shadow-card">
          <img
            src={tarjeta.qr}
            alt={`Código QR con el contacto de ${tarjeta.nombre}`}
            width="1000"
            height="1000"
            className="w-full h-auto block"
          />
        </div>

        <svg
          className="mt-8 text-graphite"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="7" y="2.5" width="10" height="19" rx="2" />
          <path d="M11 18.5h2M3 8.5h1.5M3 12h1.5M3 15.5h1.5" />
        </svg>
        <p className="mt-3 text-[15px] leading-[1.5] text-graphite m-0">
          Escaneá para guardar
          <br />
          mi contacto
        </p>
      </div>

      <div className="relative bg-parchment pt-10 pb-9 text-center">
        <svg
          className="absolute top-[-1px] left-0 w-full"
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0 0 Q50 10 100 0 L100 0 L0 0 Z" fill="#F2EDE4" />
        </svg>
        <Link
          to={`/${tarjeta.slug}`}
          className="font-serif text-[30px] tracking-[-0.015em] text-graphite no-underline"
        >
          Psiquiatri<span className="italic text-accent">x</span>
        </Link>
        <p className="mt-1.5 text-[13px] text-accent m-0">www.psiquiatrix.ar</p>
      </div>
    </div>
  );
}
