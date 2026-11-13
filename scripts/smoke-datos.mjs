/**
 * Smoke de la capa de datos del frontend contra el emulador.
 * Usa el SDK web de Firebase (igual que la app) para confirmar que las queries
 * del catálogo devuelven lo sembrado y no requieren índices faltantes.
 *
 * Corre vía: firebase emulators:exec (ver comando en el reporte).
 */
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  collectionGroup,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';

const app = initializeApp({ projectId: process.env.GOOGLE_CLOUD_PROJECT || 'demo-estelar' });
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);

let fail = 0;
function check(cond, msg) {
  console.log(`  ${cond ? '✓' : '✗'} ${msg}`);
  if (!cond) fail++;
}

async function main() {
  // 1) Sedes activas ordenadas (query del hero/landing)
  const venuesSnap = await getDocs(
    query(collection(db, 'venues'), where('activa', '==', true), orderBy('orden')),
  );
  check(venuesSnap.size === 5, `venues activas ordenadas = 5 (${venuesSnap.size})`);
  const ordenes = venuesSnap.docs.map((d) => d.data().orden);
  check(
    ordenes.every((v, i) => i === 0 || v >= ordenes[i - 1]),
    `orden ascendente correcto [${ordenes.join(',')}]`,
  );

  // 2) Una sede por slug
  const antioquia = await getDocs(
    query(collection(db, 'venues'), where('slug', '==', 'antioquia'), where('activa', '==', true)),
  );
  check(antioquia.size === 1, 'venue por slug "antioquia" = 1');
  const venueId = antioquia.docs[0].id;

  // 3) Domos de la sede (subcolección)
  const domosSnap = await getDocs(
    query(collection(db, 'venues', venueId, 'glampings'), where('activo', '==', true)),
  );
  check(domosSnap.size === 2, `domos activos de Antioquia = 2 (${domosSnap.size})`);

  // 4) Domos destacados (collectionGroup) — usado en la landing
  const cgSnap = await getDocs(
    query(collectionGroup(db, 'glampings'), where('activo', '==', true)),
  );
  check(cgSnap.size === 7, `collectionGroup glampings activos = 7 (${cgSnap.size})`);

  // 5) Extras activos
  const extrasSnap = await getDocs(query(collection(db, 'extras'), where('activo', '==', true)));
  check(extrasSnap.size === 3, `extras activos = 3 (${extrasSnap.size})`);

  // 6) Testimonios aprobados (regla de lectura pública)
  const testSnap = await getDocs(
    query(collection(db, 'testimonials'), where('aprobado', '==', true)),
  );
  check(testSnap.size === 2, `testimonios aprobados = 2 (${testSnap.size})`);

  console.log(fail === 0 ? '\n✅ Capa de datos OK — todas las queries del frontend responden.' : `\n❌ ${fail} checks fallaron.`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
