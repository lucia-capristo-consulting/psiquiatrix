import Seo from '../seo/Seo.jsx';
import { pageByPath } from '../seo/pages.js';
import PsicoHero from '../components/psico/PsicoHero.jsx';
import PsicoIncertidumbre from '../components/psico/PsicoIncertidumbre.jsx';
import Pillars from '../components/Pillars.jsx';
import PsicoDirectoras from '../components/psico/PsicoDirectoras.jsx';
import PsicoProceso from '../components/psico/PsicoProceso.jsx';
import PsicoContacto from '../components/psico/PsicoContacto.jsx';

export default function Psicologos() {
  return (
    <>
      <Seo {...pageByPath('/psicologos')} />
      <PsicoHero />
      <div id="como-trabajamos">
        <PsicoIncertidumbre />
        <Pillars />
      </div>
      <PsicoDirectoras />
      <PsicoProceso />
      <PsicoContacto />
    </>
  );
}
