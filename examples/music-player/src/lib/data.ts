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
  album: string;
  genres: string[];
  cover: string;
  audioSrc: string;
  year: number;
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

export interface Venue {
  id: string;
  name: string;
  lat: number;
  lng: number;
  photo?: string; // /venues/<slug>.webp
  description?: string;
}

export interface MusicEvent {
  id: string;
  title: string;
  poster: string;
  date: string;
  time: string;
  venueId: string; // → Venue.id
  venue: string;
  description: string;
  lat: number;
  lng: number;
  lineup: string[]; // artist ids
  venuePhoto?: string; // optional /venues/<slug> thumbnail
  venueDescription?: string; // optional short venue blurb
}

// 15 tracks pulled from 6 albums, each keeping its real album art.
const POOL = [
  {
    "title": "Amanecer",
    "album": "buena-vista",
    "albumName": "Le chant des Stompbox",
    "track": 4,
    "year": 2021,
    "duration": "0:45"
  },
  {
    "title": "Calle Sin Nombre",
    "album": "buena-vista",
    "albumName": "Le chant des Stompbox",
    "track": 1,
    "year": 2019,
    "duration": "0:45"
  },
  {
    "title": "Bajo la Lluvia",
    "album": "plenero",
    "albumName": "Nfamoudou-Boudougou",
    "track": 6,
    "year": 2019,
    "duration": "0:45"
  },
  {
    "title": "Raíz",
    "album": "ile",
    "albumName": "You Know Where to Find Me",
    "track": 2,
    "year": 2023,
    "duration": "0:45"
  },
  {
    "title": "Mar de Fondo",
    "album": "buena-vista",
    "albumName": "Le chant des Stompbox",
    "track": 5,
    "year": 2023,
    "duration": "5:43"
  },
  {
    "title": "Último Tren",
    "album": "residente",
    "albumName": "Koi-discovery",
    "track": 6,
    "year": 2017,
    "duration": "0:45"
  },
  {
    "title": "Luz de Patio",
    "album": "buena-vista",
    "albumName": "Le chant des Stompbox",
    "track": 2,
    "year": 2023,
    "duration": "5:14"
  },
  {
    "title": "Tormenta",
    "album": "residente",
    "albumName": "Koi-discovery",
    "track": 3,
    "year": 2022,
    "duration": "0:45"
  },
  {
    "title": "Son del Cangrejo",
    "album": "residente",
    "albumName": "Koi-discovery",
    "track": 5,
    "year": 2019,
    "duration": "4:58"
  },
  {
    "title": "Noche en Vela",
    "album": "ile",
    "albumName": "You Know Where to Find Me",
    "track": 4,
    "year": 2019,
    "duration": "2:25"
  },
  {
    "title": "Ron y Café",
    "album": "tony-croatto",
    "albumName": "Seven Elements",
    "track": 5,
    "year": 2017,
    "duration": "0:45"
  },
  {
    "title": "Sereno",
    "album": "ile",
    "albumName": "You Know Where to Find Me",
    "track": 5,
    "year": 2020,
    "duration": "0:45"
  },
  {
    "title": "Vuelo Nocturno",
    "album": "control-machete",
    "albumName": "City Slacker",
    "track": 1,
    "year": 2020,
    "duration": "0:45"
  },
  {
    "title": "Tierra Adentro",
    "album": "plenero",
    "albumName": "Nfamoudou-Boudougou",
    "track": 2,
    "year": 2017,
    "duration": "0:45"
  },
  {
    "title": "Marejada",
    "album": "tony-croatto",
    "albumName": "Seven Elements",
    "track": 6,
    "year": 2024,
    "duration": "1:23"
  }
];

function songsFor(artistId: string, artist: string, idxs: number[], genres: string[][]): Song[] {
  return idxs.map((pi, i) => {
    const p = POOL[pi];
    return {
      id: `${artistId}-${pi}`,
      title: p.title,
      artist,
      artistId,
      album: p.albumName,
      genres: genres[i],
      cover: `/albums/${p.album}/cover.jpg`,
      audioSrc: `/albums/${p.album}/${String(p.track).padStart(2, "0")}.mp3`,
      year: p.year,
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
    bio: "Piano-led Latin jazz with a late-night, smoke-curl mood. Andrés studied classical in Madrid, then unlearned most of it in the clubs of Santurce. His trio stretches a standard until it's barely recognizable, then folds it home just as you give up on it. Nothing is rushed; nothing is wasted.",
    performing: { date: "May 10", venue: "Plaza del Mercado" },
    distanceKm: 0.9,
    songs: songsFor("andres-montalvo", "Andrés Montalvo", [0,1,4,6,7,8,10,11,12,13,14], [["Bolero"],["Jazz Latino","Bolero","Cumbia"],["Jazz Latino","Bolero"],["Jazz Latino"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"]]),
  },
  {
    id: "diego-salcedo",
    name: "Diego Salcedo",
    photo: "/artists/diego-salcedo/cover.webp",
    avatar: "/artists/diego-salcedo/avatar.webp",
    genres: ["Rock en Español","Indie"],
    bio: "Fuzzed-out guitars and shout-along choruses in Spanish. Diego fronts the loudest band on this bill and seems genuinely delighted about it. The songs are bigger than the rooms he plays, which is most of the fun. Expect feedback, a broken string or two, and a crowd that knows every word by the bridge.",
    performing: { date: "May 10", venue: "Plaza del Mercado" },
    distanceKm: 1.9,
    songs: songsFor("diego-salcedo", "Diego Salcedo", [0,1,2,3,4,5,6,7,8,9,10,13], [["Rock en Español","Indie"],["Rock en Español","Indie","Cumbia"],["Rock en Español","Indie"],["Rock en Español"],["Rock en Español","Indie"],["Rock en Español","Indie"],["Rock en Español","Indie","Trap Latino"],["Rock en Español","Indie"],["Rock en Español","Indie"],["Rock en Español","Indie","Jazz Latino"],["Indie"],["Rock en Español","Indie"]]),
  },
  {
    id: "la-tribu-de-yaguez",
    name: "La Tribu de Yagüez",
    photo: "/artists/la-tribu-de-yaguez/cover.webp",
    avatar: "/artists/la-tribu-de-yaguez/avatar.webp",
    genres: ["Bomba","Plena"],
    bio: "Barrel drums and call-and-response straight from the bateys. The collective treats bomba as living history, not a museum piece, pulling new dancers out of the crowd all night. Their rhythms argue with each other, speed up, double back. By the second number the line between stage and audience is gone.",
    performing: { date: "May 17", venue: "Corredor de la Plena" },
    distanceKm: 2.3,
    songs: songsFor("la-tribu-de-yaguez", "La Tribu de Yagüez", [0,1,3,4,5,6,8,9,10,11,12,14], [["Bomba"],["Bomba","Plena"],["Bomba","Plena"],["Bomba"],["Bomba","Plena","Trova"],["Bomba","Plena","Trova"],["Plena"],["Bomba","Plena"],["Bomba","Plena","Hip-Hop"],["Bomba","Plena"],["Bomba","Plena"],["Bomba","Plena"]]),
  },
  {
    id: "tomas-beltran",
    name: "Tomás Beltrán",
    photo: "/artists/tomas-beltran/cover.webp",
    avatar: "/artists/tomas-beltran/avatar.webp",
    genres: ["Trova","Folk"],
    bio: "Protest songs and lullabies, sometimes in the same set. Tomás has been the conscience of the local trova scene for decades, and age has only sharpened his pen. He'll make you laugh, then quietly break your heart two verses later. A national treasure who would hate being called one.",
    performing: { date: "May 17", venue: "Corredor de la Plena" },
    distanceKm: 2.9,
    songs: songsFor("tomas-beltran", "Tomás Beltrán", [2,3,4,5,7,10,12], [["Trova"],["Trova"],["Trova","Folk"],["Trova","Folk"],["Trova","Folk","Bomba"],["Trova","Folk","Pop Latino"],["Trova","Folk"]]),
  },
  {
    id: "los-hijos-del-caribe",
    name: "Los Hijos del Caribe",
    photo: "/artists/los-hijos-del-caribe/cover.webp",
    avatar: "/artists/los-hijos-del-caribe/avatar.webp",
    genres: ["Salsa","Son"],
    bio: "A nine-piece machine built for sweaty, all-night salsa. The horn section came up playing weddings and rallies across the island, and they swing like the floor might give out. Every arrangement leaves a window open for the dancers to answer back. They've backed half the sonero legends who pass through San Juan.",
    performing: { date: "May 24", venue: "Casa Aboy" },
    distanceKm: 3.8,
    songs: songsFor("los-hijos-del-caribe", "Los Hijos del Caribe", [0,1,2,6,7,10,12,14], [["Salsa","Son"],["Salsa","Son","Indie"],["Salsa","Son"],["Salsa","Son","Plena"],["Salsa","Son","Rock en Español"],["Salsa","Son"],["Salsa"],["Salsa","Son","Indie"]]),
  },
  {
    id: "joaquin-ferrer",
    name: "Joaquín Ferrer",
    photo: "/artists/joaquin-ferrer/cover.webp",
    avatar: "/artists/joaquin-ferrer/avatar.webp",
    genres: ["Jazz Latino","Bolero"],
    bio: "Trumpet that aches and arrangements that swing. Joaquín spent years in pit orchestras before stepping out front, and that discipline anchors even his wildest solos. He builds a set like a conversation, leaving long silences he knows exactly how to fill. The ballads are where he'll quietly get you.",
    performing: { date: "Jun 8", venue: "La Respuesta" },
    distanceKm: 5.1,
    songs: songsFor("joaquin-ferrer", "Joaquín Ferrer", [0,2,4,5,6,7,9,10,12,13], [["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Jazz Latino"],["Jazz Latino"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Jazz Latino","Bolero"],["Bolero"],["Jazz Latino","Bolero"]]),
  },
  {
    id: "marisol-vega",
    name: "Marisol Vega",
    photo: "/artists/marisol-vega/cover.webp",
    avatar: "/artists/marisol-vega/avatar.webp",
    genres: ["Bolero","Trova"],
    bio: "Velvet-voiced boleros that turn a plaza into a living room. She learned to sing in her grandmother's kitchen in Ponce, and that warmth never left her phrasing. Backed by a single nylon-string guitar, she trades the genre's grand gestures for something closer and quieter. Her shows feel less like concerts than late conversations that happen to rhyme.",
    performing: { date: "Jun 6", venue: "Coliseo de Puerto Rico" },
    distanceKm: 5.7,
    songs: songsFor("marisol-vega", "Marisol Vega", [2,3,5,9,12,13,14], [["Bolero","Trova"],["Bolero","Trova"],["Bolero","Trova"],["Bolero","Trova"],["Trova"],["Bolero"],["Bolero","Trova"]]),
  },
  {
    id: "calle-sonora",
    name: "Calle Sonora",
    photo: "/artists/calle-sonora/cover.webp",
    avatar: "/artists/calle-sonora/avatar.webp",
    genres: ["Reggaetón","Trap Latino"],
    bio: "Street-born reggaetón with hooks you can't shake loose. The duo built their first beats on a cracked laptop in Río Piedras and never lost that scrappy, blown-out energy. Underneath the bravado are real songs about leaving and staying. Live, the bass is less a sound than a physical event.",
    performing: { date: "Jun 6", venue: "Coliseo de Puerto Rico" },
    distanceKm: 6.3,
    songs: songsFor("calle-sonora", "Calle Sonora", [0,1,2,3,5,6,7,8,9,11,12,14], [["Reggaetón","Trap Latino"],["Reggaetón","Trap Latino"],["Reggaetón","Trap Latino"],["Reggaetón","Trap Latino"],["Trap Latino"],["Trap Latino"],["Reggaetón","Trap Latino"],["Reggaetón","Trap Latino"],["Reggaetón","Trap Latino"],["Reggaetón","Trap Latino"],["Reggaetón","Trap Latino"],["Reggaetón","Trap Latino"]]),
  },
  {
    id: "ruben-iglesias",
    name: "Rubén Iglesias",
    photo: "/artists/ruben-iglesias/cover.webp",
    avatar: "/artists/ruben-iglesias/avatar.webp",
    genres: ["Trova","Folk"],
    bio: "Just a guitar, a notebook, and stories about the island. Rubén writes the kind of trova that sounds offhand until a single line stops you cold. He's spent twenty years playing peñas where everyone already knows the words. No theatrics — only a steady voice and an unusually good ear for other people's lives.",
    performing: { date: "Jun 22", venue: "Coliseo de Puerto Rico" },
    distanceKm: 7.6,
    songs: songsFor("ruben-iglesias", "Rubén Iglesias", [0,1,2,3,4,5,7,8,9,10,12,13], [["Trova"],["Trova","Folk"],["Trova","Folk"],["Trova","Folk"],["Trova","Folk"],["Trova","Folk"],["Trova","Folk"],["Trova","Folk"],["Trova","Folk"],["Trova"],["Trova","Folk","Hip-Hop"],["Trova"]]),
  },
  {
    id: "camila-reyes",
    name: "Camila Reyes",
    photo: "/artists/camila-reyes/cover.webp",
    avatar: "/artists/camila-reyes/avatar.webp",
    genres: ["Pop Latino","Indie"],
    bio: "Bedroom-pop sweetness with a coastal, sunburnt glow. Camila records most of what you hear in a spare room facing the water in Rincón. Her melodies are featherlight, but the lyrics keep catching on something sharper underneath. It's the sound of a long, slightly sad summer afternoon.",
    performing: { date: "Jun 8", venue: "La Respuesta" },
    distanceKm: 8.9,
    songs: songsFor("camila-reyes", "Camila Reyes", [0,3,4,6,7], [["Pop Latino"],["Pop Latino"],["Pop Latino","Indie"],["Pop Latino","Indie"],["Indie"]]),
  },
  {
    id: "trio-boriken",
    name: "Trío Borikén",
    photo: "/artists/trio-boriken/cover.webp",
    avatar: "/artists/trio-boriken/avatar.webp",
    genres: ["Trova","Bolero"],
    bio: "Three voices, tight harmonies, old-school serenade energy. The Borikén brothers have sung together since they were kids, and it shows in how they breathe as one. Their repertoire runs from century-old boleros to songs written last week in the same style. Close your eyes and it could be any decade you like.",
    performing: { date: "May 31", venue: "Nuyorican Café" },
    distanceKm: 10.1,
    songs: songsFor("trio-boriken", "Trío Borikén", [2,3,4,6,8,10,11,14], [["Bolero"],["Bolero"],["Trova","Bolero"],["Trova","Bolero"],["Trova"],["Trova","Bolero"],["Trova","Bolero"],["Trova","Bolero","Hip-Hop"]]),
  },
  {
    id: "las-olas",
    name: "Las Olas",
    photo: "/artists/las-olas/cover.webp",
    avatar: "/artists/las-olas/avatar.webp",
    genres: ["Surf Rock","Indie"],
    bio: "Reverb-drenched surf rock made for the Ocean Park shoreline. The four-piece writes instrumentals that sound like a perfect, slightly dangerous wave. There's a vintage warmth to their tone and a sly humor to the song titles. Best heard with sand still on your feet and the tide coming in.",
    performing: { date: "May 4", venue: "Surfin" },
    distanceKm: 10.7,
    songs: songsFor("las-olas", "Las Olas", [1,5,6,12,14], [["Surf Rock","Indie","Salsa"],["Surf Rock","Indie","Plena"],["Surf Rock","Indie"],["Surf Rock","Indie"],["Surf Rock","Indie","Bomba"]]),
  },
  {
    id: "sonido-cangrejo",
    name: "Sonido Cangrejo",
    photo: "/artists/sonido-cangrejo/cover.webp",
    avatar: "/artists/sonido-cangrejo/avatar.webp",
    genres: ["Plena","Bomba"],
    bio: "Carnival-loud plena that drags the whole block into the parade. The group started as a neighborhood comparsa in Cangrejos and still plays like the street is the venue. Their songs are gossip, protest, and celebration in equal measure. Resistance is futile; you will be dancing before you decide to.",
    performing: { date: "May 24", venue: "Casa Aboy" },
    distanceKm: 11.9,
    songs: songsFor("sonido-cangrejo", "Sonido Cangrejo", [0,2,3,8,11], [["Plena","Bomba"],["Bomba"],["Plena","Bomba"],["Plena","Bomba"],["Bomba"]]),
  },
  {
    id: "valeria-cordero",
    name: "Valeria Cordero",
    photo: "/artists/valeria-cordero/cover.webp",
    avatar: "/artists/valeria-cordero/avatar.webp",
    genres: ["Bachata","Bolero"],
    bio: "Heartbreak bachata with a smoky, modern edge. Valeria writes about the messy end of things with a frankness that can sting. Her band keeps the classic guitar figures but lets the arrangements breathe and bruise. It's old-school romance for people who've stopped believing in it and want to anyway.",
    performing: { date: "Jun 18", venue: "Museo de Arte de PR" },
    distanceKm: 12.6,
    songs: songsFor("valeria-cordero", "Valeria Cordero", [0,1,2,3,4,6,7,8,10,11,13], [["Bachata","Bolero"],["Bachata"],["Bolero"],["Bachata","Bolero"],["Bachata","Bolero"],["Bachata","Bolero"],["Bachata","Bolero"],["Bachata","Bolero"],["Bachata","Bolero"],["Bachata","Bolero"],["Bachata","Bolero"]]),
  },
  {
    id: "el-bloque",
    name: "El Bloque",
    photo: "/artists/el-bloque/cover.webp",
    avatar: "/artists/el-bloque/avatar.webp",
    genres: ["Hip-Hop","Trap Latino"],
    bio: "Hard verses about the neighborhood that raised them. The crew trades bars like they're finishing each other's sentences, because they basically are. Beneath the swagger is a real chronicle of a corner of San Juan most songs ignore. Loud, funny, and a great deal sharper than it lets on.",
    performing: { date: "May 10", venue: "Plaza del Mercado" },
    distanceKm: 14,
    songs: songsFor("el-bloque", "El Bloque", [0,2,3,4,5,6,7,9,10,12,13,14], [["Hip-Hop","Trap Latino"],["Hip-Hop","Trap Latino"],["Hip-Hop","Trap Latino"],["Hip-Hop","Trap Latino"],["Hip-Hop","Trap Latino"],["Hip-Hop"],["Hip-Hop","Trap Latino"],["Hip-Hop","Trap Latino"],["Trap Latino"],["Hip-Hop","Trap Latino","Jazz Latino"],["Hip-Hop","Trap Latino"],["Hip-Hop","Trap Latino"]]),
  },
  {
    id: "natalia-quinones",
    name: "Natalia Quiñones",
    photo: "/artists/natalia-quinones/cover.webp",
    avatar: "/artists/natalia-quinones/avatar.webp",
    genres: ["Folk","Indie"],
    bio: "Fingerpicked folk and diary-page lyrics. Natalia plays so quietly that a full room will lean in without realizing it has. Her songs are small and specific — a kitchen, a bus stop, a phone that won't ring. The effect builds slowly and then stays with you for days.",
    performing: { date: "May 17", venue: "Corredor de la Plena" },
    distanceKm: 14.8,
    songs: songsFor("natalia-quinones", "Natalia Quiñones", [0,2,4,5,6,7,8,9,10,11,12], [["Folk","Indie"],["Folk","Indie"],["Folk","Indie","Rock en Español"],["Folk","Indie"],["Folk","Indie","Bachata"],["Folk"],["Folk","Indie"],["Folk","Indie"],["Folk","Indie"],["Folk","Indie"],["Indie"]]),
  },
  {
    id: "conjunto-mar-afuera",
    name: "Conjunto Mar Afuera",
    photo: "/artists/conjunto-mar-afuera/cover.webp",
    avatar: "/artists/conjunto-mar-afuera/avatar.webp",
    genres: ["Salsa","Son"],
    bio: "Classic conjunto sound, horns bright as midday sun. The band reveres the golden-age records but plays them loose enough that it never feels like a tribute. Founded by three cousins, it's grown into a rotating cast of the city's best players. Pure, unfussy, slightly sweaty joy.",
    performing: { date: "May 24", venue: "Casa Aboy" },
    distanceKm: 16.2,
    songs: songsFor("conjunto-mar-afuera", "Conjunto Mar Afuera", [0,1,2,5,6,7,8,9,10,11,12,13], [["Salsa","Son"],["Salsa","Son","Trap Latino"],["Salsa","Son"],["Salsa","Son"],["Salsa","Son"],["Son"],["Salsa","Son"],["Salsa","Son"],["Salsa","Son"],["Son"],["Salsa","Son","Plena"],["Son"]]),
  },
  {
    id: "bahia-negra",
    name: "Bahía Negra",
    photo: "/artists/bahia-negra/cover.webp",
    avatar: "/artists/bahia-negra/avatar.webp",
    genres: ["Post-Punk","Indie"],
    bio: "Cold-wave gloom with a tropical undertow. The band marries icy post-punk guitars to rhythms that could only come from here. Their shows are dim, smoke-machine affairs that somehow still make you move. Heartbreak you can dance to, played in a stubborn minor key.",
    performing: { date: "Jun 13", venue: "Balneario El Escambrón" },
    distanceKm: 17.5,
    songs: songsFor("bahia-negra", "Bahía Negra", [1,2,7,8,9,11,13,14], [["Post-Punk","Indie"],["Indie"],["Post-Punk"],["Post-Punk","Indie"],["Post-Punk"],["Post-Punk","Indie","Hip-Hop"],["Post-Punk","Indie"],["Post-Punk","Indie"]]),
  },
];

export const venues: Venue[] = [
  {
    id: "plaza-del-mercado-santurce",
    name: "Plaza del Mercado, Santurce",
    lat: 18.4663,
    lng: -66.1057,
    photo: "/venues/plaza-del-mercado-santurce.webp",
    description: "Santurce's old public market by day, a warren of bars and live music by night. The stalls clear out and the plaza fills with sound — the beating heart of the district's scene.",
  },
  {
    id: "corredor-de-la-plena-loiza",
    name: "Corredor de la Plena, Loíza",
    lat: 18.449,
    lng: -66.0739,
    photo: "/venues/corredor-de-la-plena-loiza.webp",
    description: "An open-air stretch in Loíza where bomba and plena were born and never left. The barrel drums come out after dark and the whole corredor turns into one long call-and-response.",
  },
  {
    id: "casa-aboy-miramar",
    name: "Casa Aboy, Miramar",
    lat: 18.4475,
    lng: -66.0858,
    photo: "/venues/casa-aboy-miramar.webp",
    description: "A restored Miramar mansion turned cultural house, all wood floors and porch light. Intimate enough that a single guitar carries to the back row.",
  },
  {
    id: "nuyorican-cafe-viejo-san-juan",
    name: "Nuyorican Café, Viejo San Juan",
    lat: 18.4571,
    lng: -66.079,
    photo: "/venues/nuyorican-cafe-viejo-san-juan.webp",
    description: "A narrow, brick-walled room down an Old San Juan alley, and one of the island's great live-music institutions. Salsa, jazz, and everything in between, late into the night.",
  },
  {
    id: "coliseo-de-puerto-rico",
    name: "Coliseo de Puerto Rico",
    lat: 18.4238,
    lng: -66.0735,
    photo: "/venues/coliseo-de-puerto-rico.webp",
    description: "Puerto Rico's largest arena — room for some 18,000 fans, full-scale production, and a downtown skyline backdrop. The room reserved for the biggest tours that roll through San Juan.",
  },
  {
    id: "la-respuesta-santurce",
    name: "La Respuesta, Santurce",
    lat: 18.4536,
    lng: -66.0648,
    photo: "/venues/la-respuesta-santurce.webp",
    description: "Santurce's home for the loud and the new — a dim, sweaty club that's launched half the city's bands. The booking runs from punk to perreo, and the floor never really cools down.",
  },
  {
    id: "balneario-el-escambron",
    name: "Balneario El Escambrón",
    lat: 18.4663,
    lng: -66.093,
    photo: "/venues/balneario-el-escambron.webp",
    description: "A public beach and reef just east of Old San Juan, with a low stage set almost on the sand. Shows here run on island time and end under the stars.",
  },
  {
    id: "teatro-tapia",
    name: "Teatro Tapia",
    lat: 18.4659,
    lng: -66.114,
    photo: "/venues/teatro-tapia.webp",
    description: "The oldest theater in Puerto Rico, gilded and hushed since 1832. Red velvet, painted ceilings, and acoustics built for a single voice and a guitar.",
  },
  {
    id: "surfin-aguadilla",
    name: "Surfin, Aguadilla",
    lat: 18.4283,
    lng: -66.061,
    photo: "/venues/surfin-aguadilla.webp",
    description: "A west-coast surf bar where the day starts in the water and ends with a band on the terrace. Salt, reverb, and the best sunsets on the island.",
  },
  {
    id: "hacienda-carabali-luquillo",
    name: "Hacienda Carabalí, Luquillo",
    lat: 18.4419,
    lng: -66.0617,
    photo: "/venues/hacienda-carabali-luquillo.webp",
    description: "A working ranch in the Luquillo foothills, on the edge of the rainforest. Acoustic sets under the canopy, with the coquís for a backing choir.",
  },
  {
    id: "museo-de-arte-de-pr",
    name: "Museo de Arte de PR",
    lat: 18.4602,
    lng: -66.082,
    photo: "/venues/museo-de-arte-de-pr.webp",
    description: "The island's flagship art museum, its galleries and sculpture garden thrown open after hours. Courtyards become stages and the art keeps you company between sets.",
  },
  {
    id: "conservatorio-de-musica",
    name: "Conservatorio de Música",
    lat: 18.4364,
    lng: -66.0668,
    photo: "/venues/conservatorio-de-musica.webp",
    description: "Puerto Rico's national music conservatory — a proper concert hall with a stage that's trained generations of players. Formal, warm, and tuned to perfection.",
  },
];

export const events: MusicEvent[] = [
  {
    id: "feria-del-vinilo",
    title: "Feria del Vinilo",
    poster: "/events/feria-del-vinilo.webp",
    date: "May 10",
    time: "12:00 PM",
    venueId: "plaza-del-mercado-santurce",
    venue: "Plaza del Mercado, Santurce",
    description: "A day of crate-digging, live sets, and the best record stalls on the island. Collectors haul out boxes of salsa dura, vintage trova, and rarities you won't find online, while DJs spin from a corner of the plaza. Between digs there are acoustic sets, cold drinks, and the kind of arguments only vinyl people have. Come early — the good pressings are gone by noon, and the stories are worth staying for.",
    lat: 18.4663,
    lng: -66.1057,
    lineup: ["andres-montalvo","el-bloque","diego-salcedo"],
    venuePhoto: "/venues/plaza-del-mercado-santurce.webp",
    venueDescription: "Santurce's old public market by day, a warren of bars and live music by night. The stalls clear out and the plaza fills with sound — the beating heart of the district's scene.",
  },
  {
    id: "noche-de-bomba-y-plena",
    title: "Noche de Bomba y Plena",
    poster: "/events/noche-de-bomba-y-plena.webp",
    date: "May 17",
    time: "9:00 PM",
    venueId: "corredor-de-la-plena-loiza",
    venue: "Corredor de la Plena, Loíza",
    description: "Barrel drums until sunrise — the rhythms that built Puerto Rico. Loíza's drummers and dancers take over the corredor, trading call-and-response that's been passed down for generations. The circle stays open all night, pulling newcomers in to answer the drum whether they know the steps or not. By the small hours the street, the stage, and the crowd have blurred into one moving thing.",
    lat: 18.449,
    lng: -66.0739,
    lineup: ["la-tribu-de-yaguez","el-bloque","natalia-quinones","tomas-beltran"],
    venuePhoto: "/venues/corredor-de-la-plena-loiza.webp",
    venueDescription: "An open-air stretch in Loíza where bomba and plena were born and never left. The barrel drums come out after dark and the whole corredor turns into one long call-and-response.",
  },
  {
    id: "festival-de-trova",
    title: "Festival de Trova",
    poster: "/events/festival-de-trova.webp",
    date: "May 24",
    time: "7:30 PM",
    venueId: "casa-aboy-miramar",
    venue: "Casa Aboy, Miramar",
    description: "An intimate evening of songwriters trading verses on the porch. A handful of trovadores pass a single guitar around the room, improvising décimas about whatever the night hands them. There's no setlist and no stage to speak of — just chairs, a ceiling fan, and a hundred people leaning in to catch every line. It's the oldest kind of show on the island, and still one of the best.",
    lat: 18.4475,
    lng: -66.0858,
    lineup: ["andres-montalvo","sonido-cangrejo","el-bloque","natalia-quinones","conjunto-mar-afuera","los-hijos-del-caribe"],
    venuePhoto: "/venues/casa-aboy-miramar.webp",
    venueDescription: "A restored Miramar mansion turned cultural house, all wood floors and porch light. Intimate enough that a single guitar carries to the back row.",
  },
  {
    id: "san-juan-jazz-nights",
    title: "San Juan Jazz Nights",
    poster: "/events/san-juan-jazz-nights.webp",
    date: "May 31",
    time: "9:00 PM",
    venueId: "nuyorican-cafe-viejo-san-juan",
    venue: "Nuyorican Café, Viejo San Juan",
    description: "Latin jazz in a candlelit room, sets running late into the night. The city's finest players rotate through a tight stage in Old San Juan, stretching standards until they're barely recognizable. The room is small enough to hear the brushes on the snare and the murmured count-ins between tunes. Order something, settle in, and let the sets carry you past midnight.",
    lat: 18.4571,
    lng: -66.079,
    lineup: ["trio-boriken","diego-salcedo","andres-montalvo","los-hijos-del-caribe"],
    venuePhoto: "/venues/nuyorican-cafe-viejo-san-juan.webp",
    venueDescription: "A narrow, brick-walled room down an Old San Juan alley, and one of the island's great live-music institutions. Salsa, jazz, and everything in between, late into the night.",
  },
  {
    id: "ritmo-caribe",
    title: "Ritmo Caribe",
    poster: "/events/ritmo-caribe.webp",
    date: "Jun 6",
    time: "6:00 PM",
    venueId: "coliseo-de-puerto-rico",
    venue: "Coliseo de Puerto Rico",
    description: "A celebration of every rhythm the Caribbean ever invented, blown up to arena scale. Salsa, bomba, plena, and bachata trade off on one enormous stage while the floor and the stands move as one. The lineup runs deep into the night, each act handing off to the next without letting the energy drop. Bring water, wear shoes you can move in, and plan to leave hoarse.",
    lat: 18.4238,
    lng: -66.0735,
    lineup: ["marisol-vega","calle-sonora","andres-montalvo","diego-salcedo"],
    venuePhoto: "/venues/coliseo-de-puerto-rico.webp",
    venueDescription: "Puerto Rico's largest arena — room for some 18,000 fans, full-scale production, and a downtown skyline backdrop. The room reserved for the biggest tours that roll through San Juan.",
  },
  {
    id: "sesion-nocturna",
    title: "Sesión Nocturna",
    poster: "/events/sesion-nocturna.webp",
    date: "Jun 8",
    time: "10:00 PM",
    venueId: "la-respuesta-santurce",
    venue: "La Respuesta, Santurce",
    description: "Late-night showcase for the city's loudest new acts. La Respuesta hands its stage to the rock, trap, and post-punk bands rewriting what San Juan sounds like after dark. The bill is stacked and the sets are short, so the energy never has a chance to sag. It's where you go to catch a band a year before everyone else claims they always knew.",
    lat: 18.4536,
    lng: -66.0648,
    lineup: ["andres-montalvo","camila-reyes","joaquin-ferrer","sonido-cangrejo","natalia-quinones","diego-salcedo"],
    venuePhoto: "/venues/la-respuesta-santurce.webp",
    venueDescription: "Santurce's home for the loud and the new — a dim, sweaty club that's launched half the city's bands. The booking runs from punk to perreo, and the floor never really cools down.",
  },
  {
    id: "raices-del-sol",
    title: "Raíces del Sol",
    poster: "/events/raices-del-sol.webp",
    date: "Jun 13",
    time: "5:30 PM",
    venueId: "balneario-el-escambron",
    venue: "Balneario El Escambrón",
    description: "Sunset on the beach, roots music with sand between your toes. As the light drops over El Escambrón, folk and trova acts play from a low stage just above the tide line. Families spread blankets, kids chase the last of the daylight, and it feels more like a gathering than a concert. Stay through dusk — the best sets happen once the stars come out.",
    lat: 18.4663,
    lng: -66.093,
    lineup: ["conjunto-mar-afuera","bahia-negra","los-hijos-del-caribe"],
    venuePhoto: "/venues/balneario-el-escambron.webp",
    venueDescription: "A public beach and reef just east of Old San Juan, with a low stage set almost on the sand. Shows here run on island time and end under the stars.",
  },
  {
    id: "concierto-soledad",
    title: "Concierto Soledad",
    poster: "/events/concierto-soledad.webp",
    date: "Jun 1",
    time: "8:00 PM",
    venueId: "teatro-tapia",
    venue: "Teatro Tapia",
    description: "A seated, hushed night for boleros and slow-burning ballads. Inside the island's oldest theater, a few singers and a guitar fill the room with almost no amplification at all. The audience holds its breath between phrases, and you can hear a pin drop in the gilded balconies. It's romance at its most unhurried — bring someone, or come to miss someone.",
    lat: 18.4659,
    lng: -66.114,
    lineup: ["andres-montalvo","la-tribu-de-yaguez","trio-boriken","tomas-beltran","diego-salcedo"],
    venuePhoto: "/venues/teatro-tapia.webp",
    venueDescription: "The oldest theater in Puerto Rico, gilded and hushed since 1832. Red velvet, painted ceilings, and acoustics built for a single voice and a guitar.",
  },
  {
    id: "feria-de-vida",
    title: "Feria de Vida",
    poster: "/events/feria-de-vida.webp",
    date: "May 4",
    time: "2:00 PM",
    venueId: "surfin-aguadilla",
    venue: "Surfin, Aguadilla",
    description: "West-coast festival pairing surf culture with live music. Out in Aguadilla the day starts in the water and ends with reverb-soaked sets as the sun goes down over the point. Between heats there are food stalls, board shapers, and bands playing to a sandy, salt-crusted crowd. It's the most laid-back show on the calendar, and the only one where you might catch a wave first.",
    lat: 18.4283,
    lng: -66.061,
    lineup: ["la-tribu-de-yaguez","las-olas","conjunto-mar-afuera","andres-montalvo","diego-salcedo","los-hijos-del-caribe"],
    venuePhoto: "/venues/surfin-aguadilla.webp",
    venueDescription: "A west-coast surf bar where the day starts in the water and ends with a band on the terrace. Salt, reverb, and the best sunsets on the island.",
  },
  {
    id: "fiesta-neon",
    title: "Fiesta Neón",
    poster: "/events/fiesta-neon.webp",
    date: "Jun 20",
    time: "11:00 PM",
    venueId: "la-respuesta-santurce",
    venue: "La Respuesta, Santurce",
    description: "Neon-soaked dance night for the after-hours crowd. The room goes dark, the lights go electric, and the bass doesn't let up until the place closes. Reggaetón and trap acts trade the booth with DJs who keep the floor moving between live sets. Come late, leave later — nothing here gets going before midnight.",
    lat: 18.4536,
    lng: -66.0648,
    lineup: ["diego-salcedo","las-olas","andres-montalvo","los-hijos-del-caribe"],
    venuePhoto: "/venues/la-respuesta-santurce.webp",
    venueDescription: "Santurce's home for the loud and the new — a dim, sweaty club that's launched half the city's bands. The booking runs from punk to perreo, and the floor never really cools down.",
  },
  {
    id: "encuentro-rustico",
    title: "Encuentro Rústico",
    poster: "/events/encuentro-rustico.webp",
    date: "May 28",
    time: "4:00 PM",
    venueId: "hacienda-carabali-luquillo",
    venue: "Hacienda Carabalí, Luquillo",
    description: "Mountain-side gathering, acoustic sets under the canopy. Up in the Luquillo foothills the music unplugs entirely — just voices and strings beneath the rainforest trees. The air is cooler here, the crowd smaller, and the coquís join in once the sun goes down. It's a half-day escape from the city that happens to come with a soundtrack.",
    lat: 18.4419,
    lng: -66.0617,
    lineup: ["marisol-vega","los-hijos-del-caribe","la-tribu-de-yaguez","natalia-quinones","tomas-beltran"],
    venuePhoto: "/venues/hacienda-carabali-luquillo.webp",
    venueDescription: "A working ranch in the Luquillo foothills, on the edge of the rainforest. Acoustic sets under the canopy, with the coquís for a backing choir.",
  },
  {
    id: "arte-y-musica",
    title: "Arte y Música",
    poster: "/events/arte-y-musica.webp",
    date: "Jun 18",
    time: "7:00 PM",
    venueId: "museo-de-arte-de-pr",
    venue: "Museo de Arte de PR",
    description: "Galleries open late, courtyards turned into stages. The museum throws its doors open after hours, scattering acoustic sets through the halls and gardens. You wander from a painting to a song to a sculpture, drink in hand, with no fixed route through the night. Art and music share the same rooms here, and neither asks you to choose.",
    lat: 18.4602,
    lng: -66.082,
    lineup: ["valeria-cordero","conjunto-mar-afuera","los-hijos-del-caribe"],
    venuePhoto: "/venues/museo-de-arte-de-pr.webp",
    venueDescription: "The island's flagship art museum, its galleries and sculpture garden thrown open after hours. Courtyards become stages and the art keeps you company between sets.",
  },
  {
    id: "concierto-de-guitarra",
    title: "Concierto de Guitarra",
    poster: "/events/concierto-de-guitarra.webp",
    date: "May 20",
    time: "7:30 PM",
    venueId: "conservatorio-de-musica",
    venue: "Conservatorio de Música",
    description: "A recital celebrating the six-string in all its forms. From classical études to island trova, the conservatory's stage hosts a night devoted entirely to the guitar. Students and masters trade off, and the program drifts from formal recital to something looser as the evening goes on. A quiet, attentive show for anyone who's ever loved the instrument.",
    lat: 18.4364,
    lng: -66.0668,
    lineup: ["los-hijos-del-caribe","joaquin-ferrer"],
    venuePhoto: "/venues/conservatorio-de-musica.webp",
    venueDescription: "Puerto Rico's national music conservatory — a proper concert hall with a stage that's trained generations of players. Formal, warm, and tuned to perfection.",
  },
  {
    id: "mundo-tour",
    title: "Mundo Tour",
    poster: "/events/mundo-tour.webp",
    date: "Jun 22",
    time: "8:00 PM",
    venueId: "coliseo-de-puerto-rico",
    venue: "Coliseo de Puerto Rico",
    description: "The big room — headliners and a full production show. This is the arena night, with the lights, the screens, and a crowd that fills the Coliseo to the rafters. The bill is built around the circuit's biggest draws, backed by a production that pulls out every stop. If you only catch one show this season, the spectacle here makes the case for itself.",
    lat: 18.4238,
    lng: -66.0735,
    lineup: ["ruben-iglesias","diego-salcedo","joaquin-ferrer","los-hijos-del-caribe"],
    venuePhoto: "/venues/coliseo-de-puerto-rico.webp",
    venueDescription: "Puerto Rico's largest arena — room for some 18,000 fans, full-scale production, and a downtown skyline backdrop. The room reserved for the biggest tours that roll through San Juan.",
  },
];

export function getArtist(id: string): Artist | undefined {
  return artists.find((a) => a.id === id);
}
export function getEvent(id: string): MusicEvent | undefined {
  return events.find((e) => e.id === id);
}
export function getVenue(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
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
