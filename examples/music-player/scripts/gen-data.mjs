// Regenerates src/lib/data.ts. Assets are already reorganized on disk, so this
// only emits data. Artists + event assignments are deterministic (unchanged
// from before); songs now come from a shared 15-track POOL spanning all 6
// albums (real cover art), and each artist gets a random 5-13 of them. The song
// RNG runs AFTER the event assignment so event lineups stay identical.
import fs from "node:fs";
import { execSync } from "node:child_process";

let seed = 20260625;
const rand = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};
const pick = (n, max) => {
  const s = new Set();
  while (s.size < n) s.add(Math.floor(rand() * max));
  return [...s];
};
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// ── Artists (name, genres, bio) ─────────────────────────────────────────────
const A = [
  ["Marisol Vega", ["Bolero", "Trova"], "Velvet-voiced boleros that turn a plaza into a living room. She learned to sing in her grandmother's kitchen in Ponce, and that warmth never left her phrasing. Backed by a single nylon-string guitar, she trades the genre's grand gestures for something closer and quieter. Her shows feel less like concerts than late conversations that happen to rhyme."],
  ["Los Hijos del Caribe", ["Salsa", "Son"], "A nine-piece machine built for sweaty, all-night salsa. The horn section came up playing weddings and rallies across the island, and they swing like the floor might give out. Every arrangement leaves a window open for the dancers to answer back. They've backed half the sonero legends who pass through San Juan."],
  ["Andrés Montalvo", ["Jazz Latino", "Bolero"], "Piano-led Latin jazz with a late-night, smoke-curl mood. Andrés studied classical in Madrid, then unlearned most of it in the clubs of Santurce. His trio stretches a standard until it's barely recognizable, then folds it home just as you give up on it. Nothing is rushed; nothing is wasted."],
  ["Calle Sonora", ["Reggaetón", "Trap Latino"], "Street-born reggaetón with hooks you can't shake loose. The duo built their first beats on a cracked laptop in Río Piedras and never lost that scrappy, blown-out energy. Underneath the bravado are real songs about leaving and staying. Live, the bass is less a sound than a physical event."],
  ["Rubén Iglesias", ["Trova", "Folk"], "Just a guitar, a notebook, and stories about the island. Rubén writes the kind of trova that sounds offhand until a single line stops you cold. He's spent twenty years playing peñas where everyone already knows the words. No theatrics — only a steady voice and an unusually good ear for other people's lives."],
  ["La Tribu de Yagüez", ["Bomba", "Plena"], "Barrel drums and call-and-response straight from the bateys. The collective treats bomba as living history, not a museum piece, pulling new dancers out of the crowd all night. Their rhythms argue with each other, speed up, double back. By the second number the line between stage and audience is gone."],
  ["Camila Reyes", ["Pop Latino", "Indie"], "Bedroom-pop sweetness with a coastal, sunburnt glow. Camila records most of what you hear in a spare room facing the water in Rincón. Her melodies are featherlight, but the lyrics keep catching on something sharper underneath. It's the sound of a long, slightly sad summer afternoon."],
  ["Trío Borikén", ["Trova", "Bolero"], "Three voices, tight harmonies, old-school serenade energy. The Borikén brothers have sung together since they were kids, and it shows in how they breathe as one. Their repertoire runs from century-old boleros to songs written last week in the same style. Close your eyes and it could be any decade you like."],
  ["Diego Salcedo", ["Rock en Español", "Indie"], "Fuzzed-out guitars and shout-along choruses in Spanish. Diego fronts the loudest band on this bill and seems genuinely delighted about it. The songs are bigger than the rooms he plays, which is most of the fun. Expect feedback, a broken string or two, and a crowd that knows every word by the bridge."],
  ["Las Olas", ["Surf Rock", "Indie"], "Reverb-drenched surf rock made for the Ocean Park shoreline. The four-piece writes instrumentals that sound like a perfect, slightly dangerous wave. There's a vintage warmth to their tone and a sly humor to the song titles. Best heard with sand still on your feet and the tide coming in."],
  ["Joaquín Ferrer", ["Jazz Latino", "Bolero"], "Trumpet that aches and arrangements that swing. Joaquín spent years in pit orchestras before stepping out front, and that discipline anchors even his wildest solos. He builds a set like a conversation, leaving long silences he knows exactly how to fill. The ballads are where he'll quietly get you."],
  ["Sonido Cangrejo", ["Plena", "Bomba"], "Carnival-loud plena that drags the whole block into the parade. The group started as a neighborhood comparsa in Cangrejos and still plays like the street is the venue. Their songs are gossip, protest, and celebration in equal measure. Resistance is futile; you will be dancing before you decide to."],
  ["Valeria Cordero", ["Bachata", "Bolero"], "Heartbreak bachata with a smoky, modern edge. Valeria writes about the messy end of things with a frankness that can sting. Her band keeps the classic guitar figures but lets the arrangements breathe and bruise. It's old-school romance for people who've stopped believing in it and want to anyway."],
  ["El Bloque", ["Hip-Hop", "Trap Latino"], "Hard verses about the neighborhood that raised them. The crew trades bars like they're finishing each other's sentences, because they basically are. Beneath the swagger is a real chronicle of a corner of San Juan most songs ignore. Loud, funny, and a great deal sharper than it lets on."],
  ["Natalia Quiñones", ["Folk", "Indie"], "Fingerpicked folk and diary-page lyrics. Natalia plays so quietly that a full room will lean in without realizing it has. Her songs are small and specific — a kitchen, a bus stop, a phone that won't ring. The effect builds slowly and then stays with you for days."],
  ["Conjunto Mar Afuera", ["Salsa", "Son"], "Classic conjunto sound, horns bright as midday sun. The band reveres the golden-age records but plays them loose enough that it never feels like a tribute. Founded by three cousins, it's grown into a rotating cast of the city's best players. Pure, unfussy, slightly sweaty joy."],
  ["Tomás Beltrán", ["Trova", "Folk"], "Protest songs and lullabies, sometimes in the same set. Tomás has been the conscience of the local trova scene for decades, and age has only sharpened his pen. He'll make you laugh, then quietly break your heart two verses later. A national treasure who would hate being called one."],
  ["Bahía Negra", ["Post-Punk", "Indie"], "Cold-wave gloom with a tropical undertow. The band marries icy post-punk guitars to rhythms that could only come from here. Their shows are dim, smoke-machine affairs that somehow still make you move. Heartbreak you can dance to, played in a stubborn minor key."],
];

// ── Events — unchanged ─────────────────────────────────────────────────────
const E = [
  ["Feria del Vinilo", "May 10", "Plaza del Mercado, Santurce", "A day of crate-digging, live sets, and the best record stalls on the island."],
  ["Noche de Bomba y Plena", "May 17", "Corredor de la Plena, Loíza", "Barrel drums until sunrise — the rhythms that built Puerto Rico."],
  ["Festival de Trova", "May 24", "Casa Aboy, Miramar", "An intimate evening of songwriters trading verses on the porch."],
  ["San Juan Jazz Nights", "May 31", "Nuyorican Café, Viejo San Juan", "Latin jazz in a candlelit room, sets running late into the night."],
  ["Ritmo Caribe", "Jun 6", "Anfiteatro Tito Puente", "An open-air celebration of every rhythm the Caribbean ever invented."],
  ["Sesión Nocturna", "Jun 8", "La Respuesta, Santurce", "Late-night showcase for the city's loudest new acts."],
  ["Raíces del Sol", "Jun 13", "Balneario El Escambrón", "Sunset on the beach, roots music with sand between your toes."],
  ["Concierto Soledad", "Jun 1", "Teatro Tapia", "A seated, hushed night for boleros and slow-burning ballads."],
  ["Feria de Vida", "May 4", "Surfin, Aguadilla", "West-coast festival pairing surf culture with live music."],
  ["Fiesta Neón", "Jun 20", "Club Ingeniería", "Neon-soaked dance night for the after-hours crowd."],
  ["Encuentro Rústico", "May 28", "Hacienda Carabalí, Luquillo", "Mountain-side gathering, acoustic sets under the canopy."],
  ["Arte y Música", "Jun 18", "Museo de Arte de PR", "Galleries open late, courtyards turned into stages."],
  ["Concierto de Guitarra", "May 20", "Conservatorio de Música", "A recital celebrating the six-string in all its forms."],
  ["Mundo Tour", "Jun 22", "Coliseo de Puerto Rico", "The big room — headliners and a full production show."],
];

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const artists = A.map(([name, genres, bio]) => ({ id: slug(name), name, genres, bio }));
const events = E.map(([title, date, venue, description]) => ({ id: slug(title), title, date, venue, description, lineup: [] }));

// each artist plays 1-4 random events (SAME rng sequence as before → identical)
for (const a of artists) {
  const n = 1 + Math.floor(rand() * 4);
  for (const ei of pick(Math.min(n, events.length), events.length)) {
    if (!events[ei].lineup.includes(a.id)) events[ei].lineup.push(a.id);
  }
}
for (const ev of events) if (ev.lineup.length === 0) ev.lineup.push(artists[Math.floor(rand() * artists.length)].id);

// A few "headliners" play most of the festival circuit — each ends up in 8-10
// events, so their Artist-page "will be in" rail scrolls horizontally (and their
// co-performer list gets long).
const HEADLINERS = ["andres-montalvo", "diego-salcedo", "los-hijos-del-caribe"];
const countFor = (id) => events.filter((e) => e.lineup.includes(id)).length;
for (const id of HEADLINERS) {
  const target = 8 + Math.floor(rand() * 3); // 8..10
  for (const ei of shuffle(events.map((_, i) => i))) {
    if (countFor(id) >= target) break;
    if (!events[ei].lineup.includes(id)) events[ei].lineup.push(id);
  }
}

// Real-ish San Juan coordinates, spread across the metro (Viejo SJ, Santurce,
// Condado, Miramar, Río Piedras, Hato Rey, the beaches...).
const COORDS = [
  [18.4663, -66.1057], [18.449, -66.0739], [18.4475, -66.0858], [18.4571, -66.079],
  [18.4456, -66.0709], [18.4536, -66.0648], [18.4663, -66.093], [18.4659, -66.114],
  [18.4283, -66.061], [18.4015, -66.0512], [18.4419, -66.0617], [18.4602, -66.082],
  [18.4364, -66.0668], [18.4238, -66.0735],
];
events.forEach((e, i) => {
  [e.lat, e.lng] = COORDS[i % COORDS.length];
});

// ── Song POOL: 15 tracks across all 6 albums (real cover art) ──────────────
const ALBUMS = ["buena-vista", "control-machete", "ile", "plenero", "residente", "tony-croatto"];
// Real CC album titles (see README credits) — shown as the song subtitle.
const ALBUM_NAMES = {
  "buena-vista": "Le chant des Stompbox",
  "control-machete": "City Slacker",
  "ile": "You Know Where to Find Me",
  "plenero": "Nfamoudou-Boudougou",
  "residente": "Koi-discovery",
  "tony-croatto": "Seven Elements",
};
const TITLES = [
  "Amanecer", "Calle Sin Nombre", "Bajo la Lluvia", "Raíz", "Mar de Fondo",
  "Último Tren", "Luz de Patio", "Tormenta", "Son del Cangrejo", "Noche en Vela",
  "Ron y Café", "Sereno", "Vuelo Nocturno", "Tierra Adentro", "Marejada",
];
const allTracks = [];
for (const al of ALBUMS) for (let t = 1; t <= 6; t++) allTracks.push({ album: al, track: t });
// guarantee every album appears, then fill to 15
const poolPairs = ALBUMS.map((al) => {
  const ts = allTracks.filter((p) => p.album === al);
  return ts[Math.floor(rand() * ts.length)];
});
const rest = shuffle(allTracks.filter((p) => !poolPairs.includes(p)));
while (poolPairs.length < 15) poolPairs.push(rest.pop());
shuffle(poolPairs);

const dur = (album, track) => {
  const f = `public/albums/${album}/${String(track).padStart(2, "0")}.mp3`;
  try {
    const s = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString().trim());
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  } catch {
    return "3:00";
  }
};
// Genres are assigned per artist-song below (mostly the artist's own genres),
// so a song list reads as coherent rather than randomly mixed.
const GENRE_POOL = ["Bolero", "Trova", "Salsa", "Son", "Jazz Latino", "Reggaetón", "Trap Latino", "Bomba", "Plena", "Pop Latino", "Indie", "Folk", "Bachata", "Hip-Hop", "Cumbia", "Rock en Español"];
const songGenresFor = (base) => {
  const r = rand();
  if (r < 0.6) return base; // both of the artist's genres — most songs
  if (r < 0.82) return [base[Math.floor(rand() * base.length)]]; // just one of them
  const extra = GENRE_POOL[Math.floor(rand() * GENRE_POOL.length)]; // one crossover
  return base.includes(extra) ? base : [...base, extra];
};

const POOL = poolPairs.map((p, i) => ({ title: TITLES[i], album: p.album, albumName: ALBUM_NAMES[p.album], track: p.track, year: 2017 + Math.floor(rand() * 8), duration: dur(p.album, p.track) }));

// each artist gets 5-13 random songs from the pool + per-song genres
for (const a of artists) {
  const n = 5 + Math.floor(rand() * 9); // 5..13
  a.songIdx = pick(Math.min(n, POOL.length), POOL.length).sort((x, y) => x - y);
  a.songGenres = a.songIdx.map(() => songGenresFor(a.genres));
}

// Display order: surface these six first, rest keep their original order.
const FIRST = ["andres-montalvo", "diego-salcedo", "la-tribu-de-yaguez", "tomas-beltran", "los-hijos-del-caribe", "joaquin-ferrer"];
const firstSet = new Set(FIRST);
const ordered = [
  ...FIRST.map((id) => artists.find((a) => a.id === id)).filter(Boolean),
  ...artists.filter((a) => !firstSet.has(a.id)),
];

// Distance "from you" — ascending in display order, so the feed reads as sorted
// nearest-first (the six featured artists end up closest).
let d = 0.3;
for (const a of ordered) {
  d += 0.4 + rand() * 1.2;
  a.distanceKm = Math.round(d * 10) / 10;
}

const firstEventFor = (id) => events.find((e) => e.lineup.includes(id));
const lit = (s) => JSON.stringify(s);

const out = `// Mock dataset for the demo (no backend — routing only).
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
const POOL = ${JSON.stringify(POOL, null, 2).replace(/\n/g, "\n")};

function songsFor(artistId: string, artist: string, idxs: number[], genres: string[][]): Song[] {
  return idxs.map((pi, i) => {
    const p = POOL[pi];
    return {
      id: \`\${artistId}-\${pi}\`,
      title: p.title,
      artist,
      artistId,
      album: p.albumName,
      genres: genres[i],
      cover: \`/albums/\${p.album}/cover.jpg\`,
      audioSrc: \`/albums/\${p.album}/\${String(p.track).padStart(2, "0")}.mp3\`,
      year: p.year,
      duration: p.duration,
    };
  });
}

export const artists: Artist[] = [
${ordered.map((a) => {
  const ev = firstEventFor(a.id);
  const performing = ev ? `{ date: ${lit(ev.date)}, venue: ${lit(ev.venue.split(",")[0])} }` : "undefined";
  return `  {
    id: ${lit(a.id)},
    name: ${lit(a.name)},
    photo: ${lit(`/artists/${a.id}/cover.webp`)},
    avatar: ${lit(`/artists/${a.id}/avatar.webp`)},
    genres: ${JSON.stringify(a.genres)},
    bio: ${lit(a.bio)},
    performing: ${performing},
    distanceKm: ${a.distanceKm},
    songs: songsFor(${lit(a.id)}, ${lit(a.name)}, ${JSON.stringify(a.songIdx)}, ${JSON.stringify(a.songGenres)}),
  },`;
}).join("\n")}
];

export const events: MusicEvent[] = [
${events.map((e) => `  {
    id: ${lit(e.id)},
    title: ${lit(e.title)},
    poster: ${lit(`/events/${e.id}.webp`)},
    date: ${lit(e.date)},
    venue: ${lit(e.venue)},
    description: ${lit(e.description)},
    lat: ${e.lat},
    lng: ${e.lng},
    lineup: ${JSON.stringify(e.lineup)},
  },`).join("\n")}
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
`;

fs.writeFileSync("src/lib/data.ts", out);
console.log(`POOL (15): ${POOL.map((p) => `${p.album}#${p.track}(${p.duration})`).join(", ")}`);
console.log(`albums covered: ${new Set(POOL.map((p) => p.album)).size}`);
console.log(`songs/artist: ${artists.map((a) => a.songIdx.length).join(",")}`);
console.log(`event lineup sizes: ${events.map((e) => e.lineup.length).join(",")}`);
