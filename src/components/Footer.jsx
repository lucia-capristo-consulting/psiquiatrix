import { Link } from 'react-router-dom';

const PACIENTES_LINKS = [
  { t: 'Manifiesto', href: '/#manifiesto' },
  { t: 'Quiénes somos', href: '/#quienes-somos' },
  { t: 'El recorrido', href: '/#recorrido' },
  { t: 'Agendá tu consulta', href: '/#contacto' },
];

const PSICO_LINKS = [
  { t: 'Cómo trabajamos', href: '/psicologos#como-trabajamos' },
  { t: 'Quiénes somos', href: '/psicologos#quienes-somos' },
  { t: 'Cómo derivar', href: '/psicologos#como-derivar' },
  { t: 'Quiero derivar', href: '/psicologos#derivacion' },
  { t: 'Trabajá con nosotros', ruta: '/sumate' },
];

const enlaceCls =
  'text-[13px] text-graphite font-medium tracking-[-0.005em] hover:text-accent transition-colors w-fit';

export default function Footer() {
  return (
    <footer className="bg-parchment border-t border-linen">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-14 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 mb-10">
          <div>
            <Link
              to="/"
              className="font-serif text-[28px] text-graphite tracking-[-0.015em]"
            >
              Psiquiatri<span className="italic text-accent">x</span>
            </Link>
            <p className="mt-3 text-[13px] leading-[1.55] text-taupe max-w-[260px] m-0">
              Psiquiatría profesional con mirada humana.
            </p>
          </div>

          <div>
            <div className="eyebrow text-accent !font-bold tracking-[0.26em] mb-5">
              Para pacientes
            </div>
            <nav className="flex flex-col gap-3">
              {PACIENTES_LINKS.map((l) => (
                <a
                  key={l.t}
                  href={l.href}
                  className="text-[13px] text-graphite font-medium tracking-[-0.005em] hover:text-accent transition-colors w-fit"
                >
                  {l.t}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <div className="eyebrow text-accent !font-bold tracking-[0.26em] mb-5">
              Para profesionales
            </div>
            <nav className="flex flex-col gap-3">
              {/* Los de ancla son <a> porque saltan dentro de la página; el
                  de /sumate es una ruta y va con Link, para no recargar. */}
              {PSICO_LINKS.map((l) =>
                l.ruta ? (
                  <Link key={l.t} to={l.ruta} className={enlaceCls}>
                    {l.t}
                  </Link>
                ) : (
                  <a key={l.t} href={l.href} className={enlaceCls}>
                    {l.t}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>

        <div className="border-t border-linen pt-6 flex flex-col md:flex-row md:justify-between gap-2 mono-tag text-taupe">
          <span>© 2026 PSIQUIATRIX · BUENOS AIRES, ARGENTINA</span>
          <span>POLÍTICA DE PRIVACIDAD · LEY 25.326</span>
        </div>
      </div>
    </footer>
  );
}
