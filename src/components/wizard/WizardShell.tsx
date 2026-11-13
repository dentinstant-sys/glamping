/**
 * Shell propio del wizard de reserva.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import PinoMarca from '../ui/PinoMarca';
import Stepper from './Stepper';

export default function WizardShell({ paso, children }: { paso: number; children: ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-linea bg-fondo px-6 py-3.5 sm:px-8">
        <Link
          to="/"
          className="-my-2 flex items-center gap-2.5 py-2 text-tinta"
          aria-label="Alma Verde — inicio"
        >
          <PinoMarca className="h-6 w-8 text-oro" />
          <span className="font-display text-[18px] tracking-[0.22em]">ALMA VERDE</span>
        </Link>
        <Link
          to="/"
          className="dato flex min-h-[44px] items-center gap-2 px-2 transition-colors hover:text-oro-texto"
        >
          Cerrar
          <span aria-hidden="true">✕</span>
        </Link>
      </div>

      <Stepper paso={paso} />

      <main id="contenido">{children}</main>
    </>
  );
}