import { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Pacientes from './pages/Pacientes.jsx';
import Psicologos from './pages/Psicologos.jsx';
import Sumate from './pages/Sumate.jsx';
import Tarjeta from './pages/Tarjeta.jsx';
import TarjetaMostrar from './pages/TarjetaMostrar.jsx';
import { TARJETAS } from './contenido/tarjetas.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Las tarjetas digitales van FUERA del Layout: no llevan el nav ni el
            pie del sitio. Quien llega ahi escaneo un QR y busca una sola cosa;
            el menu de la web seria ruido. */}
        {TARJETAS.map((t) => (
          <Fragment key={t.slug}>
            <Route path={`/${t.slug}`} element={<Tarjeta slug={t.slug} />} />
            <Route path={`/${t.slug}/tarjeta`} element={<TarjetaMostrar slug={t.slug} />} />
          </Fragment>
        ))}

        {/* La convocatoria tambien va fuera del Layout: el nav del sitio
            conmuta por audiencia y sus anclas no existen en esta pagina. */}
        <Route path="/sumate" element={<Sumate />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Pacientes />} />
          <Route path="/psicologos" element={<Psicologos />} />
          <Route path="*" element={<Pacientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
