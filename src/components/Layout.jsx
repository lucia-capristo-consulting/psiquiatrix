import { Outlet } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import FloatingCTA from './FloatingCTA.jsx';

export default function Layout() {
  /* El scroll al tope de cada ruta lo hace <ScrollToTop /> en App.jsx: asi
     vale tambien para /sumate y las tarjetas, que van fuera de este Layout. */
  return (
    <div className="bg-bone text-graphite">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
