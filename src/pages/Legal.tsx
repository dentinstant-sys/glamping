/**
 * Páginas legales (términos, privacidad).
 * Contenido base; el texto definitivo lo aporta el cliente/legal.
 */
import Layout from '../components/layout/Layout';
import { useAsync } from '../lib/useAsync';
import { fetchContactoPublico } from '../lib/contacto';

interface Seccion {
  titulo: string;
  parrafos: string[];
}

const TERMINOS: Seccion[] = [
  {
    titulo: 'Reservas y pagos',
    parrafos: [
      'Las reservas se confirman una vez recibido el pago a través de la pasarela Bold. El precio se calcula noche por noche según el tramo del día (domingo a jueves, viernes, y sábados o festivos).',
      'El total mostrado durante la reserva es un estimado; el valor definitivo se confirma al momento de reservar y queda registrado en el comprobante.',
    ],
  },
  {
    titulo: 'Política de cancelación',
    parrafos: [
      'Las condiciones de cancelación y reembolso se informan al momento de reservar. Te recomendamos revisarlas antes de confirmar tu pago.',
    ],
  },
  {
    titulo: 'Reglamento del domo',
    parrafos: [
      'Cada domo tiene una capacidad máxima de huéspedes que debe respetarse. El check-in es desde las 3:00 p. m. y el check-out hasta el mediodía, salvo acuerdo distinto con la sede.',
    ],
  },
];

const PRIVACIDAD: Seccion[] = [
  {
    titulo: 'Tratamiento de datos',
    parrafos: [
      'Alma Verde trata tus datos personales (nombre, correo y teléfono) con la única finalidad de gestionar tu reserva y comunicarte información relacionada con tu estadía.',
      'No compartimos tus datos con terceros distintos a los necesarios para procesar el pago (Bold) y prestar el servicio.',
    ],
  },
];

function seccionDerechos(correo: string): Seccion {
  return {
    titulo: 'Tus derechos',
    parrafos: [
      correo
        ? `Puedes solicitar el acceso, corrección o eliminación de tus datos escribiéndonos a ${correo}.`
        : 'Puedes solicitar el acceso, corrección o eliminación de tus datos escribiéndonos por WhatsApp desde el botón de contacto del sitio.',
    ],
  };
}

function Pagina({ titulo, secciones }: { titulo: string; secciones: Seccion[] }) {
  return (
    <Layout>
      <div className="mx-auto grid max-w-[1240px] gap-10 px-6 pt-36 pb-[var(--spacing-blk)] sm:px-8 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="dato dato-oro">Legal</p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(32px,5vw,56px)] text-tinta">{titulo}</h1>
        </div>

        <div>
          {secciones.map((s, i) => (
            <section key={s.titulo} className="regla grid grid-cols-[auto_1fr] gap-x-6 py-8">
              <span className="numeral pt-1.5 text-[12px]">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="text-[clamp(20px,2.6vw,26px)] text-tinta">{s.titulo}</h2>
                {s.parrafos.map((p, j) => (
                  <p key={j} className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-tinta-2">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
          <p className="dato mt-10 normal-case tracking-normal">
            Documento informativo. El texto legal definitivo será provisto por Alma Verde.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export function Terminos() {
  return <Pagina titulo="Términos y condiciones" secciones={TERMINOS} />;
}

export function Privacidad() {
  const contacto = useAsync(fetchContactoPublico, []);
  const secciones = [...PRIVACIDAD, seccionDerechos(contacto.data?.email ?? '')];
  return <Pagina titulo="Política de privacidad" secciones={secciones} />;
}