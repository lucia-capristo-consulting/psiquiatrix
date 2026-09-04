import { Link } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { pageByPath } from '../seo/pages.js';
import Footer from '../components/Footer.jsx';
import SumateHero from '../components/sumate/SumateHero.jsx';
import {
  SumateTrabajo,
  SumateDireccion,
  SumatePerfil,
  SumateNoEs,
} from '../components/sumate/SumateSecciones.jsx';
import SumateForm from '../components/sumate/SumateForm.jsx';

/**
 * Convocatoria para psiquiatras.
 *
 * Va FUERA del Layout, con una cabecera propia mínima. El nav del sitio
 * conmuta entre pacientes y psicólogos y sus anclas apuntan a secciones que
 * esta página no tiene; además se decidió no sumar la convocatoria al menú,
 * para no cambiarle el tono a un sitio que le habla a pacientes.
 */
export default function Sumate() {
  return (
    <div className="bg-bone text-graphite">
      <Seo {...pageByPath('/sumate')} />

      <header className="border-b border-linen">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-14 h-[72px] flex items-center">
          <Link
            to="/"
            className="font-serif text-[26px] md:text-[28px] text-graphite tracking-tight leading-none no-underline"
          >
            Psiquiatri<span className="text-accent italic">x</span>
          </Link>
        </div>
      </header>

      <main>
        <SumateHero />
        <SumateTrabajo />
        <SumateDireccion />
        <SumatePerfil />
        <SumateNoEs />
        <SumateForm />
      </main>

      <Footer />
    </div>
  );
}
