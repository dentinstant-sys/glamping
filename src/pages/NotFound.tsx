/**
 * 404.
 */
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <Layout>
      <div className="mx-auto flex min-h-[70svh] max-w-[1240px] flex-col justify-center px-6 py-32 sm:px-8">
        <p className="numeral text-[clamp(64px,16vw,180px)] leading-none">404</p>
        <h1 className="mt-6 max-w-[16ch] text-[clamp(32px,6vw,64px)] text-tinta">
          Esta página no existe
        </h1>
        <p className="mt-6 max-w-[44ch] text-tinta-2">
          El enlace que seguiste no lleva a ninguna parte, o la página cambió de lugar. Volvamos
          bajo las estrellas.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link to="/">
            <Button variant="solid" className="w-full sm:w-auto">
              Ir al inicio
            </Button>
          </Link>
          <Link to="/reservar">
            <Button variant="ghost" className="w-full sm:w-auto">
              Ver disponibilidad
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}