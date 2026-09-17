import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Al cambiar de ruta el browser conserva la altura del scroll: entrar a
   /sumate desde el pie —que esta abajo de todo— te dejaba en el final de la
   pagina nueva. Va montado arriba de las Routes y no adentro del Layout
   porque /sumate y las tarjetas quedan fuera de el. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
