/**
 * Layout público: capa de destellos + Header + contenido + Footer + WhatsApp.
 * `heroOscuro` avisa al Header de que arranca sobre un hero oscuro
 * (texto claro hasta el primer scroll).
 *
 * Incluye enlace de salto: con 5 enlaces de navegación más el logo, quien
 * navega con teclado tendría que tabular toda la cabecera en cada página para
 * llegar al contenido.
 */
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFAB from './WhatsAppFAB';
import SkyFX from '../ui/SkyFX';

export default function Layout({
  children,
  heroOscuro = false,
}: {
  children: ReactNode;
  heroOscuro?: boolean;
}) {
  return (
    <>
      {/* Oculto hasta recibir foco por teclado. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:flex focus:min-h-[44px] focus:items-center focus:bg-oro focus:px-5 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-white"
      >
        Saltar al contenido
      </a>
      <SkyFX />
      <Header heroOscuro={heroOscuro} />
      <main id="contenido">{children}</main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
