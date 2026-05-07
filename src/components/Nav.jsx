import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useActiveSection from '../hooks/useActiveSection';

const NAV_PACIENTES = [
  { t: 'Manifiesto', anchor: 'manifiesto' },
  { t: 'Quiénes somos', anchor: 'quienes-somos' },
  { t: 'El recorrido', anchor: 'recorrido' },
];
const NAV_PSICO = [
  { t: 'Cómo trabajamos', anchor: 'como-trabajamos' },
  { t: 'Quiénes somos', anchor: 'quienes-somos' },
  { t: 'Cómo derivar', anchor: 'como-derivar' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isPsico = pathname.startsWith('/psicologos');
  const homePath = isPsico ? '/psicologos' : '/';

  const navItems = isPsico ? NAV_PSICO : NAV_PACIENTES;
  const crossLink = isPsico
    ? { t: 'Soy paciente', to: '/' }
    : { t: 'Soy psicólogo/a', to: '/psicologos' };

  const ctaLabel = isPsico ? 'Quiero derivar' : 'Agendá tu consulta';
  const ctaHref = isPsico ? '#derivacion' : '#contacto';

  const active = useActiveSection(navItems.map((i) => i.anchor));

  const handleLogoClick = (e) => {
    if (pathname === homePath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      e.preventDefault();
      navigate(homePath);
    }
  };

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      className="sticky top-0 z-40 bg-bone/85 backdrop-blur border-b border-linen"
    >
      <div className="mx-auto max-w-[1280px] flex items-center justify-between gap-9 px-6 lg:px-14 py-5">
        <Link
          to={homePath}
          onClick={handleLogoClick}
          className="font-serif text-[28px] md:text-[31px] text-graphite tracking-tight leading-none cursor-pointer"
        >
          Psiquiatri<span className="text-accent italic">x</span>
        </Link>

        <nav className="hidden lg:flex flex-1 justify-center gap-11">
          {navItems.map(({ t, anchor }) => {
            const isActive = active === anchor;
            return (
              <a
                key={t}
                href={`#${anchor}`}
                className={`relative text-[13.5px] tracking-[-0.005em] font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-graphite hover:text-accent'
                }`}
              >
                {t}
                <span
                  className={`absolute left-0 right-0 -bottom-1.5 h-px bg-accent origin-left transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
          <Link
            to={crossLink.to}
            className="text-[13.5px] tracking-normal text-accent font-semibold transition-colors hover:opacity-80"
          >
            {crossLink.t}
          </Link>
        </nav>

        <a
          href={ctaHref}
          className="rounded-full bg-accent text-bone px-5 py-2.5 text-[13px] font-medium tracking-[-0.005em] shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-cta"
        >
          {ctaLabel}
        </a>
      </div>
    </motion.header>
  );
}
