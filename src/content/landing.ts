/**
 * Contenido editorial de la landing (textos del diseño aprobado).
 * Separado en datos para mantener las secciones limpias. El catálogo (sedes,
 * domos, testimonios) viene de Firestore; esto es solo el copy estático.
 */

export const PILARES = [
  {
    nombre: 'Conecta',
    texto:
      'Domos aislados entre sí, rodeados de naturaleza. Aquí el mejor plan es no tener ninguno.',
  },
  {
    nombre: 'Descansa',
    texto:
      'Jacuzzi privado climatizado, cama king y desayuno servido en la puerta de tu domo.',
  },
  {
    nombre: 'Recuerda',
    texto:
      'Cielo abierto, fogata y atardeceres que se quedan contigo mucho después de volver.',
  },
];

export const STATS = [
  { valor: '5', label: 'Sedes en Colombia' },
  { valor: '4.9', label: 'Calificación de huéspedes' },
  { valor: '100%', label: 'Privacidad garantizada' },
  { valor: '24/7', label: 'Servicio a tu domo' },
];

export const EXPERIENCIAS = [
  {
    num: '01',
    nombre: 'Alojamiento premium',
    texto:
      'Domos de autor con jacuzzi climatizado, cama king y vistas que cambian con cada hora del día.',
  },
  {
    num: '02',
    nombre: 'Noches bajo las estrellas',
    texto:
      'Telescopio, cielo abierto y un guía que te enseña a leer las constelaciones de la montaña.',
  },
  {
    num: '03',
    nombre: 'Gastronomía',
    texto:
      'Cena privada bajo las estrellas, desayuno servido en el jacuzzi y cócteles de autor en la puerta de tu domo.',
  },
  {
    num: '04',
    nombre: 'Relax',
    texto:
      'Masajes en pareja dentro del domo y un spa que llega hasta ti. Solo tienes que dejarte llevar.',
  },
  {
    num: '05',
    nombre: 'Aventura',
    texto:
      'Senderos, cabalgatas y naturaleza alrededor de cada sede, para los que no saben quedarse quietos.',
  },
  {
    num: '06',
    nombre: 'Celebraciones',
    texto:
      'Decoración, luces y sorpresas para aniversarios, cumpleaños o esa pregunta que llevas tiempo planeando.',
  },
];

export const MOMENTOS = [
  {
    nombre: 'En pareja',
    texto: 'El plan perfecto para reconectar lejos de todo y volver a verse de verdad.',
  },
  {
    nombre: 'En familia',
    texto: 'Naturaleza, espacio y tranquilidad para los que viajan con los suyos.',
  },
  {
    nombre: 'Para ti',
    texto: 'Un viaje a solas para apagar el ruido y reencontrarte con la calma.',
  },
  {
    nombre: 'Celebraciones',
    texto: 'Aniversarios, cumpleaños o pedidas de mano que merecen un escenario distinto.',
  },
  {
    nombre: 'Escapadas express',
    texto: 'Dos noches para desconectar entre semana y volver como nuevos.',
  },
];

export const FAQ = [
  {
    q: '¿La experiencia es solo para parejas?',
    a: 'Está pensada principalmente para dos. Algunos domos admiten huéspedes adicionales según la sede — escríbenos y te confirmamos la capacidad de cada uno.',
  },
  {
    q: '¿El jacuzzi es privado y climatizado?',
    a: 'Sí. Cada domo tiene su propio jacuzzi climatizado de uso exclusivo, disponible a cualquier hora durante toda tu estadía.',
  },
  {
    q: '¿Qué incluye la tarifa?',
    a: 'Incluye la estadía por noche para dos personas, desayuno e impuestos. Las experiencias adicionales (cena, masajes, decoración) se agregan aparte.',
  },
  {
    q: '¿La tarifa cambia según el día?',
    a: 'Sí: tenemos tres tramos — domingo a jueves, viernes, y sábados o domingos de festivo. El precio por noche varía según el día y el domo elegido.',
  },
  {
    q: '¿Cómo funciona el pago?',
    a: 'Reservas en línea con pago seguro a través de Bold. Recibes confirmación inmediata y todos los detalles de tu reserva por correo.',
  },
  {
    q: '¿Puedo agregar experiencias a mi reserva?',
    a: 'Claro. Durante la reserva puedes sumar cena romántica, desayuno especial, masajes, decoración y más. También puedes pedirlas escribiéndonos antes de tu llegada.',
  },
  {
    q: '¿Hay wifi y señal en los domos?',
    a: 'Sí, cada domo cuenta con wifi. Aun así, la idea es desconectarse — la mejor señal aquí es la del cielo despejado.',
  },
  {
    q: '¿Aceptan mascotas?',
    a: 'Depende de la sede. Algunas son pet-friendly y otras no. Cuéntanos por WhatsApp y te indicamos las opciones disponibles.',
  },
  {
    q: '¿Cómo llego a cada sede?',
    a: 'Cada sede tiene su propia ruta y punto de encuentro. Al confirmar tu reserva te enviamos la ubicación exacta y las indicaciones para llegar sin perderte.',
  },
  {
    q: '¿Puedo cambiar o cancelar mi reserva?',
    a: 'Sí, dentro de los plazos de nuestra política de cancelación. Te compartimos las condiciones al momento de reservar para que todo quede claro.',
  },
];
