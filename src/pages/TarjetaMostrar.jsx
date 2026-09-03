import Seo from '../seo/Seo.jsx';
import { tarjetaPorSlug } from '../contenido/tarjetas.js';
import TarjetaQR from '../components/tarjeta/TarjetaQR.jsx';

export default function TarjetaMostrar({ slug }) {
  const tarjeta = tarjetaPorSlug(slug);
  if (!tarjeta) return null;

  return (
    <>
      {/* noindex: es la pantalla que ella muestra, no una pagina para buscar. */}
      <Seo
        title={`Tarjeta de ${tarjeta.nombre} | PsiquiatriX`}
        description={`Código QR con el contacto de ${tarjeta.nombre}.`}
        path={`/${slug}/tarjeta`}
        noindex
      />
      <TarjetaQR tarjeta={tarjeta} />
    </>
  );
}
