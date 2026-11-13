import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';

/**
 * Rutas del frontend público.
 * Home es eager (primera visita); el resto es lazy para mantener el bundle
 * inicial pequeño (mejor LCP).
 */
import Home from './pages/Home';

const Sede = lazy(() => import('./pages/Sede'));
const Glamping = lazy(() => import('./pages/Glamping'));
const Reservar = lazy(() => import('./pages/Reservar'));
const MiReserva = lazy(() => import('./pages/MiReserva'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Terminos = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terminos })));
const Privacidad = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacidad })));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div className="grid min-h-dvh place-items-center text-tinta-2">Cargando…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sede/:slug" element={<Sede />} />
          <Route path="/glamping/:venueSlug/:glampingSlug" element={<Glamping />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/mi-reserva" element={<MiReserva />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
