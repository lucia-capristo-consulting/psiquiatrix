import Seo from '../seo/Seo.jsx';
import { medicalClinicSchema } from '../seo/schema.js';
import Hero from '../components/Hero.jsx';
import TrustStrip from '../components/TrustStrip.jsx';
import Manifesto from '../components/Manifesto.jsx';
import SectionX from '../components/SectionX.jsx';
import Process from '../components/Process.jsx';
import Team from '../components/Team.jsx';
import CTA from '../components/CTA.jsx';
import ImportantInfo from '../components/ImportantInfo.jsx';

export default function Pacientes() {
  return (
    <>
      <Seo
        title="PsiquiatriX | Psiquiatría online en Argentina con mirada humana"
        description="Atención psiquiátrica online para adultos en Argentina. Criterio clínico, mirada humana y seguimiento real. Solicitá contacto con PsiquiatriX."
        path="/"
        jsonLd={medicalClinicSchema}
      />
      <Hero />
      <TrustStrip />
      <Manifesto />
      <SectionX />
      <Process />
      <Team />
      <CTA />
      <ImportantInfo />
    </>
  );
}
