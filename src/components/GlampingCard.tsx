/**
 * Ficha de domo (landing + sede).
 */
import { Link } from 'react-router-dom';
import type { GlampingUI, VenueUI } from '../lib/catalogo';
import { fmtCOP } from '../lib/format';
import Imagen from './ui/Imagen';

export default function GlampingCard({
  glamping,
  venue,
}: {
  glamping: GlampingUI;
  venue: VenueUI;
}) {
  const url = `/glamping/${venue.slug}/${glamping.slug}`;

  return (
    <article className="ficha flex flex-col">
      <Link to={url} className="group relative block aspect-[3/2] overflow-hidden">
        <Imagen
          src={glamping.fotos?.[0]}
          alt={`${glamping.nombre} · ${venue.nombre}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-royal)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-0 top-4 rounded-r-[6px] bg-white/95 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-tinta">
          {glamping.tipo}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="dato dato-oro">{venue.nombre}</p>
        <h3 className="mt-2 text-[24px] leading-tight text-tinta">
          <Link to={url} className="transition-colors hover:text-oro-texto">
            {glamping.nombre}
          </Link>
        </h3>

        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          <div className="flex items-baseline gap-1.5">
            <dt className="sr-only">Capacidad</dt>
            <dd className="numeral text-[13px] text-tinta">{glamping.capacidad}</dd>
            <span className="text-[13px] text-tinta-2">huéspedes</span>
          </div>
          {glamping.amenities?.slice(0, 2).map((a) => (
            <div key={a}>
              <dt className="sr-only">Incluye</dt>
              <dd className="text-[13px] text-tinta-2">{a}</dd>
            </div>
          ))}
        </dl>

        {glamping.descripcion && (
          <p className="mt-3 line-clamp-2 text-[14.5px] text-tinta-2">{glamping.descripcion}</p>
        )}

        <div className="regla mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <p className="dato">Desde · por noche</p>
            <p className="numeral mt-1 text-[22px] text-tinta">{fmtCOP(glamping.precioDesde)}</p>
          </div>
          <Link
            to={`/reservar?sede=${venue.slug}&domo=${glamping.slug}`}
            className="flex min-h-[44px] items-center rounded-[var(--radius-control)] bg-oro px-5 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-oro-texto"
          >
            Reservar
          </Link>
        </div>
      </div>
    </article>
  );
}