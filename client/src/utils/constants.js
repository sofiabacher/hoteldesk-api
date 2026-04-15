// ----------------------- Roles -------------------------------------------
export const ROLE_ROUTES = {
  admin: '/admin',
  recepcionist: '/recepcionist',
  cleaning: '/cleaning',
  guest: '/booking'
}

export const ROLES_LIST = [
  { id: 1, name: 'Huésped' },
  { id: 2, name: 'Administrador' },
  { id: 3, name: 'Recepcionista' },
  { id: 4, name: 'Limpieza' }
]

// ----------------------- Animations -------------------------------------------
export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

export const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } }
}

export const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
  exit: (direction) => ({ x: direction < 0 ? 1000 : -1000, opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } })
}


// ----------------------- Reviews -------------------------------------------
export const REVIEWS = [
  { name: 'María López', comment: 'Hermosa estadía, atención impecable.', stars: 5, avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Carlos Perez', comment: 'Muy cómodo y limpio, volvería sin dudas.', stars: 4, avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Lucia Fernández', comment: 'Excelente ubicación y desayuno delicioso.', stars: 5, avatar: 'https://i.pravatar.cc/150?img=32' },
  { name: 'Julián Torres', comment: 'Buena relación precio-calidad.', stars: 4, avatar: 'https://i.pravatar.cc/150?img=45' },
  { name: 'Valentina Gómez', comment: 'Las habitaciones son un sueño.', stars: 5, avatar: 'https://i.pravatar.cc/150?img=9' }
]

// ----------------------- Rooms -------------------------------------------
export const ROOMS = [
  { title: 'Habitación Estándar', description: 'Habitación económica perfecta para viajeros y parejas', image: 'http://localhost:3000/uploads/rooms/estandar/101.jpg', price: '$69 - $89', features: ['WiFi Gratis', 'Smart TV', 'Aire Acondicionado'] },
  { title: 'Habitación Deluxe', description: 'Confort premium con vistas parciales al océano', image: 'http://localhost:3000/uploads/rooms/deluxe/201.jpg', price: '$129 - $179', features: ['WiFi Gratis', 'Smart TV', 'Aire Acondicionado', 'Minibar'] },
  { title: 'Suite Ejecutiva', description: 'Espacio de trabajo integrado con vistas panorámicas', image: 'http://localhost:3000/uploads/rooms/ejecutiva/301.jpg', price: '$189 - $239', features: ['WiFi Gratis', 'Smart TV', 'Aire Acondicionado', 'Escritorio de Trabajo', 'Balcón'] },
  { title: 'Habitación Familiar', description: 'Diseñada para familias con niños pequeños', image: 'http://localhost:3000/uploads/rooms/familiar/401.jpg', price: '$169 - $249', features: ['WiFi Gratis', 'Smart TV', 'Aire Acondicionado', 'Camas Adicionales', 'Amigable para Niños'] },
  { title: 'Suite Presidential', description: 'La máxima experiencia de lujo con vistas de 360°', image: 'http://localhost:3000/uploads/rooms/presidencial/501.jpg', price: '$399 - $799', features: ['WiFi Gratis', 'Smart TV', 'Aire Acondicionado', 'Jacuzzi', 'Balcón', 'Servicio de Mayordomo'] }
]

// ----------------------- Room States -------------------------------------------
export const ROOM_STATES = {
  1: { label: 'Disponible', color: 'primary' },
  2: { label: 'Ocupada', color: 'error' },
  3: { label: 'En mantenimiento', color: 'warning' },
  4: { label: 'En limpieza', color: 'info' },
  5: { label: 'Fuera de servicio', color: 'disabled' }
}

export const ROOM_STATE_VALUES = {
  AVAILABLE: 1,
  OCCUPIED: 2,
  MAINTENANCE: 3,
  CLEANING: 4,
  OUT_OF_SERVICE: 5
}

// ----------------------- Room Types -------------------------------------------
export const ROOM_TYPES = [
  'Estandar',
  'Deluxe',
  'Ejecutiva',
  'Familiar',
  'Presidencial'
]

// ----------------------- Room Amenities ------------------------------------
export const AMENITY_OPTIONS = [
  'wifi',
  'tv',
  'ac',
  'minibar',
  'balcony',
  'work-desk',
  'coffee-machine',
  'jacuzzi',
  'extra-beds',
  'kid-friendly',
  'game-console',
  'dining-area',
  'separate-living',
  'kitchen'
]

export const AMENITY_LABELS = {
  'wifi': { label: 'WiFi Gratis', icon: '📶' },
  'tv': { label: 'TV Smart', icon: '📺' },
  'ac': { label: 'Aire Acondicionado', icon: '❄️' },
  'minibar': { label: 'Mini Bar', icon: '🍾' },
  'balcony': { label: 'Balcón', icon: '🌅' },
  'work-desk': { label: 'Escritorio de Trabajo', icon: '💼' },
  'coffee-machine': { label: 'Máquina de Café', icon: '☕' },
  'jacuzzi': { label: 'Jacuzzi', icon: '🛁' },
  'extra-beds': { label: 'Camas Adicionales', icon: '🛏️' },
  'kid-friendly': { label: 'Amigable para Niños', icon: '👶' },
  'game-console': { label: 'Consola de Videojuegos', icon: '🎮' },
  'dining-area': { label: 'Área de Comedor', icon: '🍽️' },
  'separate-living': { label: 'Sala Separada', icon: '🛋️' },
  'kitchen': { label: 'Cocina', icon: '🍳' }
}

// ----------------------- Users -------------------------------------------
export const USER_STATE_LABELS = {
  1: 'Activo',
  2: 'Inactivo',
  3: 'Bloqueado',
  4: 'Eliminado'
}

export const USER_STATE_VALUES = {
  ACTIVE: 1,
  INACTIVE: 2,
  BLOCKED: 3,
  DELETED: 4
}


