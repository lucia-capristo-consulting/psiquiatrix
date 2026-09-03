import Seo from '../seo/Seo.jsx';
import { pageByPath } from '../seo/pages.js';
import { tarjetaPorSlug } from '../contenido/tarjetas.js';
import TarjetaDigital from '../components/tarjeta/TarjetaDigital.jsx';

export default function Tarjeta({ slug }) {
  const tarjeta = tarjetaPorSlug(slug);
  if (!tarjeta) return null;

  return (
    <>
      <Seo {...pageByPath(`/${slug}`)} />
      <TarjetaDigital tarjeta={tarjeta} />
    </>
  );
}
