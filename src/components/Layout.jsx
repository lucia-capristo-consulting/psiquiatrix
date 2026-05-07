import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import FloatingCTA from './FloatingCTA.jsx';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

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
