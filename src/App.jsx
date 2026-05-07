import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Pacientes from './pages/Pacientes.jsx';
import Psicologos from './pages/Psicologos.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Pacientes />} />
          <Route path="/psicologos" element={<Psicologos />} />
          <Route path="*" element={<Pacientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
