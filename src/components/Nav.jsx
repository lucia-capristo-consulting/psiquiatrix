import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú mobile al cambiar de ruta (paciente <-> psicólogo).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogoClick = (e) => {
    setMenuOpen(false);
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
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="lg:hidden inline-flex items-center justify-center -ml-1 p-2 text-graphite hover:text-accent transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>

          <Link
            to={homePath}
            onClick={handleLogoClick}
            className="font-serif text-[28px] md:text-[31px] text-graphite tracking-tight leading-none cursor-pointer"
          >
            Psiquiatri<span className="text-accent italic">x</span>
          </Link>
        </div>

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
          onClick={() => setMenuOpen(false)}
          className="rounded-full bg-accent text-bone px-5 py-2.5 text-[13px] font-medium tracking-[-0.005em] shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-cta"
        >
          {ctaLabel}
        </a>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="lg:hidden overflow-hidden border-t border-linen bg-bone/95 backdrop-blur"
          >
            <div className="mx-auto max-w-[1280px] px-6 py-4 flex flex-col gap-1">
              {navItems.map(({ t, anchor }) => {
                const isActive = active === anchor;
                return (
                  <a
                    key={t}
                    href={`#${anchor}`}
                    onClick={() => setMenuOpen(false)}
                    className={`py-2.5 text-[15px] font-medium tracking-[-0.005em] transition-colors ${
                      isActive ? 'text-accent' : 'text-graphite hover:text-accent'
                    }`}
                  >
                    {t}
                  </a>
                );
              })}
              <Link
                to={crossLink.to}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-[15px] font-semibold text-accent transition-colors hover:opacity-80"
              >
                {crossLink.t}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
