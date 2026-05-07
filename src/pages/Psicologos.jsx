import Seo from '../seo/Seo.jsx';
import { psicologosServiceSchema } from '../seo/schema.js';
import PsicoHero from '../components/psico/PsicoHero.jsx';
import PsicoIncertidumbre from '../components/psico/PsicoIncertidumbre.jsx';
import Pillars from '../components/Pillars.jsx';
import PsicoDirectoras from '../components/psico/PsicoDirectoras.jsx';
import PsicoProceso from '../components/psico/PsicoProceso.jsx';
import PsicoContacto from '../components/psico/PsicoContacto.jsx';

export default function Psicologos() {
  return (
    <>
      <Seo
        title="Derivaciones psiquiátricas para psicólogos | PsiquiatriX"
        description="PsiquiatriX trabaja con psicólogos derivadores con comunicación profesional, continuidad terapéutica y criterio clínico compartido. Conocé cómo derivar."
        path="/psicologos"
        jsonLd={psicologosServiceSchema}
      />
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
