// Mock dataset for the demo (no backend — routing only).
//
// Display layer (names, photos, genres, events, copy) is fictional, paired with
// stock photography. Songs are drawn from a shared 15-track pool spanning 6
// Creative-Commons albums (real cover art per track); see README/NOTES for
// credits. Each artist plays a random 5-13 of them.

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  audioSrc: string;
  duration: string;
}

export interface Artist {
  id: string;
  name: string;
  photo: string; // landscape — feed rectangle + page hero
  avatar: string; // square — shown in a circle
  genres: string[];
  bio: string;
  performing?: { date: string; venue: string };
  distanceKm: number;
  songs: Song[];
}

export interface MusicEvent {
  id: string;
  title: string;
  poster: string;
  date: string;
  venue: string;
  description: string;
  lat: number;
  lng: number;
  lineup: string[]; // artist ids
}

// 15 tracks pulled from 6 albums, each keeping its real album art.
const POOL = [
  {
    "title": "Amanecer",
    "album": "control-machete",
    "track": 3,
    "duration": "2:31"
  },
  {
    "title": "Calle Sin Nombre",
    "album": "plenero",
    "track": 4,
    "duration": "1:34"
  },
  {
    "title": "Bajo la Lluvia",
    "album": "ile",
    "track": 6,
    "duration": "0:45"
  },
  {
    "title": "Raíz",
    "album": "ile",
    "track": 2,
    "duration": "0:45"
  },
  {
    "title": "Mar de Fondo",
    "album": "tony-croatto",
    "track": 3,
    "duration": "0:45"
  },
  {
    "title": "Último Tren",
    "album": "tony-croatto",
    "track": 2,
    "duration": "0:45"
  },
  {
    "title": "Luz de Patio",
    "album": "buena-vista",
    "track": 2,
    "duration": "5:14"
  },
  {
    "title": "Tormenta",
    "album": "buena-vista",
    "track": 4,
    "duration": "0:45"
  },
  {
    "title": "Son del Cangrejo",
    "album": "buena-vista",
    "track": 5,
    "duration": "5:43"
  },
  {
    "title": "Noche en Vela",
    "album": "tony-croatto",
    "track": 1,
    "duration": "1:27"
  },
  {
    "title": "Ron y Café",
    "album": "buena-vista",
    "track": 3,
    "duration": "0:45"
  },
  {
    "title": "Sereno",
    "album": "plenero",
    "track": 6,
    "duration": "0:45"
  },
  {
    "title": "Vuelo Nocturno",
    "album": "plenero",
    "track": 2,
    "duration": "0:45"
  },
  {
    "title": "Tierra Adentro",
    "album": "control-machete",
    "track": 4,
    "duration": "0:45"
  },
  {
    "title": "Marejada",
    "album": "residente",
    "track": 2,
    "duration": "0:45"
  }
];

function songsFor(artistId: string, artist: string, idxs: number[]): Song[] {
  return idxs.map((pi) => {
    const p = POOL[pi];
    return {
      id: `${artistId}-${pi}`,
      title: p.title,
      artist,
      artistId,
      cover: `/albums/${p.album}/cover.jpg`,
      audioSrc: `/albums/${p.album}/${String(p.track).padStart(2, "0")}.mp3`,
      duration: p.duration,
    };
  });
}

export const artists: Artist[] = [
  {
    id: "andres-montalvo",
    name: "Andrés Montalvo",
    photo: "/artists/andres-montalvo/cover.webp",
    avatar: "/artists/andres-montalvo/avatar.webp",
    genres: ["Jazz Latino","Bolero"],
    bio: "Piano-led Latin jazz with a late-night, smoke-curl mood.",
    performing: { date: "May 10", venue: "Plaza del Mercado" },
    distanceKm: 1.5,
    songs: songsFor("andres-montalvo", "Andrés Montalvo", [3,4,8,9,10,11]),
  },
  {
    id: "diego-salcedo",
    name: "Diego Salcedo",
    photo: "/artists/diego-salcedo/cover.webp",
    avatar: "/artists/diego-salcedo/avatar.webp",
    genres: ["Rock en Español","Indie"],
    bio: "Fuzzed-out guitars and shout-along choruses in Spanish.",
    performing: { date: "May 31", venue: "Nuyorican Café" },
    distanceKm: 2,
    songs: songsFor("diego-salcedo", "Diego Salcedo", [0,1,3,4,6,7,8,9,10,11,12,13,14]),
  },
  {
    id: "la-tribu-de-yaguez",
    name: "La Tribu de Yagüez",
    photo: "/artists/la-tribu-de-yaguez/cover.webp",
    avatar: "/artists/la-tribu-de-yaguez/avatar.webp",
    genres: ["Bomba","Plena"],
    bio: "Barrel drums and call-and-response straight from the bateys.",
    performing: { date: "May 17", venue: "Corredor de la Plena" },
    distanceKm: 3.2,
    songs: songsFor("la-tribu-de-yaguez", "La Tribu de Yagüez", [2,3,4,5,7,9,10,13]),
  },
  {
    id: "tomas-beltran",
    name: "Tomás Beltrán",
    photo: "/artists/tomas-beltran/cover.webp",
    avatar: "/artists/tomas-beltran/avatar.webp",
    genres: ["Trova","Folk"],
    bio: "Protest songs and lullabies, sometimes in the same set.",
    performing: { date: "May 17", venue: "Corredor de la Plena" },
    distanceKm: 3.7,
    songs: songsFor("tomas-beltran", "Tomás Beltrán", [1,3,4,6,7,9,11,14]),
  },
  {
    id: "los-hijos-del-caribe",
    name: "Los Hijos del Caribe",
    photo: "/artists/los-hijos-del-caribe/cover.webp",
    avatar: "/artists/los-hijos-del-caribe/avatar.webp",
    genres: ["Salsa","Son"],
    bio: "A nine-piece machine built for sweaty, all-night salsa.",
    performing: { date: "May 28", venue: "Hacienda Carabalí" },
    distanceKm: 4.5,
    songs: songsFor("los-hijos-del-caribe", "Los Hijos del Caribe", [2,4,6,7,8,9,10,11,13,14]),
  },
  {
    id: "joaquin-ferrer",
    name: "Joaquín Ferrer",
    photo: "/artists/joaquin-ferrer/cover.webp",
    avatar: "/artists/joaquin-ferrer/avatar.webp",
    genres: ["Jazz Latino","Bolero"],
    bio: "Trumpet that aches; arrangements that swing.",
    performing: { date: "Jun 8", venue: "La Respuesta" },
    distanceKm: 5.1,
    songs: songsFor("joaquin-ferrer", "Joaquín Ferrer", [0,1,2,5,6,7,8,9,11,12,14]),
  },
  {
    id: "marisol-vega",
    name: "Marisol Vega",
    photo: "/artists/marisol-vega/cover.webp",
    avatar: "/artists/marisol-vega/avatar.webp",
    genres: ["Bolero","Trova"],
    bio: "Velvet-voiced boleros that turn a plaza into a living room.",
    performing: { date: "Jun 6", venue: "Anfiteatro Tito Puente" },
    distanceKm: 6.4,
    songs: songsFor("marisol-vega", "Marisol Vega", [0,1,2,3,4,6,7,9,10,11,12,14]),
  },
  {
    id: "calle-sonora",
    name: "Calle Sonora",
    photo: "/artists/calle-sonora/cover.webp",
    avatar: "/artists/calle-sonora/avatar.webp",
    genres: ["Reggaetón","Trap Latino"],
    bio: "Street-born reggaetón with hooks you can't shake.",
    performing: { date: "Jun 6", venue: "Anfiteatro Tito Puente" },
    distanceKm: 7.4,
    songs: songsFor("calle-sonora", "Calle Sonora", [0,1,3,5,10,11,12]),
  },
  {
    id: "ruben-iglesias",
    name: "Rubén Iglesias",
    photo: "/artists/ruben-iglesias/cover.webp",
    avatar: "/artists/ruben-iglesias/avatar.webp",
    genres: ["Trova","Folk"],
    bio: "Just a guitar, a notebook, and stories about the island.",
    performing: { date: "Jun 22", venue: "Coliseo de Puerto Rico" },
    distanceKm: 8.3,
    songs: songsFor("ruben-iglesias", "Rubén Iglesias", [1,2,3,4,7,9,12,13,14]),
  },
  {
    id: "camila-reyes",
    name: "Camila Reyes",
    photo: "/artists/camila-reyes/cover.webp",
    avatar: "/artists/camila-reyes/avatar.webp",
    genres: ["Pop Latino","Indie"],
    bio: "Bedroom-pop sweetness with a coastal, sunburnt glow.",
    performing: { date: "Jun 8", venue: "La Respuesta" },
    distanceKm: 8.9,
    songs: songsFor("camila-reyes", "Camila Reyes", [0,1,2,7,12,14]),
  },
  {
    id: "trio-boriken",
    name: "Trío Borikén",
    photo: "/artists/trio-boriken/cover.webp",
    avatar: "/artists/trio-boriken/avatar.webp",
    genres: ["Trova","Bolero"],
    bio: "Three voices, tight harmonies, old-school serenade energy.",
    performing: { date: "May 31", venue: "Nuyorican Café" },
    distanceKm: 10.2,
    songs: songsFor("trio-boriken", "Trío Borikén", [0,1,4,5,6,7,9,11,12,13,14]),
  },
  {
    id: "las-olas",
    name: "Las Olas",
    photo: "/artists/las-olas/cover.webp",
    avatar: "/artists/las-olas/avatar.webp",
    genres: ["Surf Rock","Indie"],
    bio: "Reverb-drenched surf rock made for the Ocean Park shoreline.",
    performing: { date: "May 4", venue: "Surfin" },
    distanceKm: 11.4,
    songs: songsFor("las-olas", "Las Olas", [2,3,4,6,8,12]),
  },
  {
    id: "sonido-cangrejo",
    name: "Sonido Cangrejo",
    photo: "/artists/sonido-cangrejo/cover.webp",
    avatar: "/artists/sonido-cangrejo/avatar.webp",
    genres: ["Plena","Bomba"],
    bio: "Carnival-loud plena that drags the whole block into the parade.",
    performing: { date: "May 24", venue: "Casa Aboy" },
    distanceKm: 12,
    songs: songsFor("sonido-cangrejo", "Sonido Cangrejo", [1,2,7,8,9,10,11,12]),
  },
  {
    id: "valeria-cordero",
    name: "Valeria Cordero",
    photo: "/artists/valeria-cordero/cover.webp",
    avatar: "/artists/valeria-cordero/avatar.webp",
    genres: ["Bachata","Bolero"],
    bio: "Heartbreak bachata with a smoky, modern edge.",
    performing: { date: "Jun 18", venue: "Museo de Arte de PR" },
    distanceKm: 13,
    songs: songsFor("valeria-cordero", "Valeria Cordero", [0,1,3,5,7,8,10,12,13]),
  },
  {
    id: "el-bloque",
    name: "El Bloque",
    photo: "/artists/el-bloque/cover.webp",
    avatar: "/artists/el-bloque/avatar.webp",
    genres: ["Hip-Hop","Trap Latino"],
    bio: "Hard verses about the neighborhood that raised them.",
    performing: { date: "May 10", venue: "Plaza del Mercado" },
    distanceKm: 14.3,
    songs: songsFor("el-bloque", "El Bloque", [1,2,3,4,5,6,7,9,13]),
  },
  {
    id: "natalia-quinones",
    name: "Natalia Quiñones",
    photo: "/artists/natalia-quinones/cover.webp",
    avatar: "/artists/natalia-quinones/avatar.webp",
    genres: ["Folk","Indie"],
    bio: "Fingerpicked folk and diary-page lyrics.",
    performing: { date: "May 17", venue: "Corredor de la Plena" },
    distanceKm: 15,
    songs: songsFor("natalia-quinones", "Natalia Quiñones", [0,1,4,7,11,12,14]),
  },
  {
    id: "conjunto-mar-afuera",
    name: "Conjunto Mar Afuera",
    photo: "/artists/conjunto-mar-afuera/cover.webp",
    avatar: "/artists/conjunto-mar-afuera/avatar.webp",
    genres: ["Salsa","Son"],
    bio: "Classic conjunto sound, horns bright as midday sun.",
    performing: { date: "May 24", venue: "Casa Aboy" },
    distanceKm: 16.1,
    songs: songsFor("conjunto-mar-afuera", "Conjunto Mar Afuera", [0,1,3,4,5,6,8,10,11,12,14]),
  },
  {
    id: "bahia-negra",
    name: "Bahía Negra",
    photo: "/artists/bahia-negra/cover.webp",
    avatar: "/artists/bahia-negra/avatar.webp",
    genres: ["Post-Punk","Indie"],
    bio: "Cold-wave gloom with a tropical undertow.",
    performing: { date: "Jun 13", venue: "Balneario El Escambrón" },
    distanceKm: 16.9,
    songs: songsFor("bahia-negra", "Bahía Negra", [0,1,2,3,4,6,7,10,12,13,14]),
  },
];

export const events: MusicEvent[] = [
  {
    id: "feria-del-vinilo",
    title: "Feria del Vinilo",
    poster: "/events/feria-del-vinilo.webp",
    date: "May 10",
    venue: "Plaza del Mercado, Santurce",
    description: "A day of crate-digging, live sets, and the best record stalls on the island.",
    lat: 18.4663,
    lng: -66.1057,
    lineup: ["andres-montalvo","el-bloque"],
  },
  {
    id: "noche-de-bomba-y-plena",
    title: "Noche de Bomba y Plena",
    poster: "/events/noche-de-bomba-y-plena.webp",
    date: "May 17",
    venue: "Corredor de la Plena, Loíza",
    description: "Barrel drums until sunrise — the rhythms that built Puerto Rico.",
    lat: 18.449,
    lng: -66.0739,
    lineup: ["la-tribu-de-yaguez","el-bloque","natalia-quinones","tomas-beltran"],
  },
  {
    id: "festival-de-trova",
    title: "Festival de Trova",
    poster: "/events/festival-de-trova.webp",
    date: "May 24",
    venue: "Casa Aboy, Miramar",
    description: "An intimate evening of songwriters trading verses on the porch.",
    lat: 18.4475,
    lng: -66.0858,
    lineup: ["andres-montalvo","sonido-cangrejo","el-bloque","natalia-quinones","conjunto-mar-afuera"],
  },
  {
    id: "san-juan-jazz-nights",
    title: "San Juan Jazz Nights",
    poster: "/events/san-juan-jazz-nights.webp",
    date: "May 31",
    venue: "Nuyorican Café, Viejo San Juan",
    description: "Latin jazz in a candlelit room, sets running late into the night.",
    lat: 18.4571,
    lng: -66.079,
    lineup: ["trio-boriken","diego-salcedo"],
  },
  {
    id: "ritmo-caribe",
    title: "Ritmo Caribe",
    poster: "/events/ritmo-caribe.webp",
    date: "Jun 6",
    venue: "Anfiteatro Tito Puente",
    description: "An open-air celebration of every rhythm the Caribbean ever invented.",
    lat: 18.4456,
    lng: -66.0709,
    lineup: ["marisol-vega","calle-sonora"],
  },
  {
    id: "sesion-nocturna",
    title: "Sesión Nocturna",
    poster: "/events/sesion-nocturna.webp",
    date: "Jun 8",
    venue: "La Respuesta, Santurce",
    description: "Late-night showcase for the city's loudest new acts.",
    lat: 18.4536,
    lng: -66.0648,
    lineup: ["andres-montalvo","camila-reyes","joaquin-ferrer","sonido-cangrejo","natalia-quinones"],
  },
  {
    id: "raices-del-sol",
    title: "Raíces del Sol",
    poster: "/events/raices-del-sol.webp",
    date: "Jun 13",
    venue: "Balneario El Escambrón",
    description: "Sunset on the beach, roots music with sand between your toes.",
    lat: 18.4663,
    lng: -66.093,
    lineup: ["conjunto-mar-afuera","bahia-negra"],
  },
  {
    id: "concierto-soledad",
    title: "Concierto Soledad",
    poster: "/events/concierto-soledad.webp",
    date: "Jun 1",
    venue: "Teatro Tapia",
    description: "A seated, hushed night for boleros and slow-burning ballads.",
    lat: 18.4659,
    lng: -66.114,
    lineup: ["andres-montalvo","la-tribu-de-yaguez","trio-boriken","tomas-beltran"],
  },
  {
    id: "feria-de-vida",
    title: "Feria de Vida",
    poster: "/events/feria-de-vida.webp",
    date: "May 4",
    venue: "Surfin, Aguadilla",
    description: "West-coast festival pairing surf culture with live music.",
    lat: 18.4283,
    lng: -66.061,
    lineup: ["la-tribu-de-yaguez","las-olas","conjunto-mar-afuera"],
  },
  {
    id: "fiesta-neon",
    title: "Fiesta Neón",
    poster: "/events/fiesta-neon.webp",
    date: "Jun 20",
    venue: "Club Ingeniería",
    description: "Neon-soaked dance night for the after-hours crowd.",
    lat: 18.4015,
    lng: -66.0512,
    lineup: ["diego-salcedo","las-olas"],
  },
  {
    id: "encuentro-rustico",
    title: "Encuentro Rústico",
    poster: "/events/encuentro-rustico.webp",
    date: "May 28",
    venue: "Hacienda Carabalí, Luquillo",
    description: "Mountain-side gathering, acoustic sets under the canopy.",
    lat: 18.4419,
    lng: -66.0617,
    lineup: ["marisol-vega","los-hijos-del-caribe","la-tribu-de-yaguez","natalia-quinones","tomas-beltran"],
  },
  {
    id: "arte-y-musica",
    title: "Arte y Música",
    poster: "/events/arte-y-musica.webp",
    date: "Jun 18",
    venue: "Museo de Arte de PR",
    description: "Galleries open late, courtyards turned into stages.",
    lat: 18.4602,
    lng: -66.082,
    lineup: ["valeria-cordero","conjunto-mar-afuera"],
  },
  {
    id: "concierto-de-guitarra",
    title: "Concierto de Guitarra",
    poster: "/events/concierto-de-guitarra.webp",
    date: "May 20",
    venue: "Conservatorio de Música",
    description: "A recital celebrating the six-string in all its forms.",
    lat: 18.4364,
    lng: -66.0668,
    lineup: ["los-hijos-del-caribe","joaquin-ferrer"],
  },
  {
    id: "mundo-tour",
    title: "Mundo Tour",
    poster: "/events/mundo-tour.webp",
    date: "Jun 22",
    venue: "Coliseo de Puerto Rico",
    description: "The big room — headliners and a full production show.",
    lat: 18.4238,
    lng: -66.0735,
    lineup: ["ruben-iglesias","diego-salcedo","joaquin-ferrer"],
  },
];

export function getArtist(id: string): Artist | undefined {
  return artists.find((a) => a.id === id);
}
export function getEvent(id: string): MusicEvent | undefined {
  return events.find((e) => e.id === id);
}
/** Events this artist appears in. */
export function eventsForArtist(id: string): MusicEvent[] {
  return events.filter((e) => e.lineup.includes(id));
}
/** Other artists sharing any event with this one (de-duped). */
export function coPerformers(id: string): Artist[] {
  const ids = new Set<string>();
  for (const e of eventsForArtist(id)) for (const a of e.lineup) if (a !== id) ids.add(a);
  return [...ids].map(getArtist).filter((a): a is Artist => !!a);
}
