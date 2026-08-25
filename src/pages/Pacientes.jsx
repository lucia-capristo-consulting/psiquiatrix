import Seo from '../seo/Seo.jsx';
import { pageByPath } from '../seo/pages.js';
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
      <Seo {...pageByPath('/')} />
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
