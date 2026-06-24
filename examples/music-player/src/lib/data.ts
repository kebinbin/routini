// Mock dataset for the demo (no backend — routing only).
//
// Display layer (names, photos, genres, events, copy) follows the Figma.
// The audio + album art are real Creative-Commons albums from the design's
// `artists/` set — so the demo is legally shippable and actually plays. Each
// Figma artist is matched to one CC album; `credit` records the real source for
// attribution (see the About/credits surface).

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string; // square album art
  audioSrc: string;
  duration: string;
}

export interface Artist {
  id: string;
  name: string;
  photo: string; // landscape — feed rectangle + page hero
  genres: string[];
  bio: string;
  performing?: { date: string; venue: string };
  credit: string; // real CC source for the audio/art
  songs: Song[];
}

export interface MusicEvent {
  id: string;
  title: string;
  poster: string;
  date: string;
  venue: string;
  description: string;
  lineup: string[];
}

const DUR = ["3:24", "4:12", "2:58", "3:47", "4:05", "3:31"];

function album(slug: string, artist: string, titles: string[]): Song[] {
  const cover = `/albums/${slug}/cover.jpg`;
  return titles.map((title, i) => ({
    id: `${slug}-${i + 1}`,
    title,
    artist,
    artistId: slug,
    cover,
    audioSrc: `/albums/${slug}/${String(i + 1).padStart(2, "0")}.mp3`,
    duration: DUR[i] ?? "3:00",
  }));
}

export const artists: Artist[] = [
  {
    id: "tony-croatto",
    name: "Tony Croatto",
    photo: "/artists/tony-croatto.webp",
    genres: ["Folk", "Trova", "Latin"],
    bio: "A defining voice of Puerto Rican folk music, blending European roots with the island's traditions.",
    performing: { date: "May 6", venue: "Viejo San Juan" },
    credit: "The Wanderer — Seven Elements",
    songs: album("tony-croatto", "Tony Croatto", [
      "The River",
      "Coldness",
      "The Storm",
      "The Sky",
      "Thunder",
      "The Wind",
    ]),
  },
  {
    id: "ile",
    name: "iLe",
    photo: "/artists/ile.webp",
    genres: ["Bolero", "Latin", "Soul"],
    bio: "Singer and composer whose voice bridges classic Latin American song and a bold contemporary edge.",
    performing: { date: "May 8", venue: "Santurce" },
    credit: "Soft and Furious — You Know Where to Find Me",
    songs: album("ile", "iLe", [
      "Is This Fruit Edible",
      "Return to the Basis",
      "Granular Dreams",
      "Still Weaker than Them",
      "Falling into the Game",
      "And Never Come Back",
    ]),
  },
  {
    id: "residente",
    name: "Residente",
    photo: "/artists/residente.webp",
    genres: ["Hip-hop", "Latin", "Alternative"],
    bio: "Puerto Rican rapper, singer, songwriter and filmmaker — co-founder of the alternative band Calle 13, and one of the most awarded Latin artists of his generation.",
    performing: { date: "May 5", venue: "Surfin, Aguadilla" },
    credit: "Ane-Chrysalide — Koi-discovery",
    songs: album("residente", "Residente", [
      "Erase Data",
      "Ultimate Rainbow",
      "Next Step",
      "Atlas Shoulders",
      "Blue Moment",
      "Negative Vortex",
    ]),
  },
  {
    id: "plenero",
    name: "Plenero de la Cresta",
    photo: "/artists/plenero.webp",
    genres: ["Plena", "Bomba", "Folk"],
    bio: "Carrying bomba and plena — the heartbeat of Puerto Rican street music — to a new generation.",
    performing: { date: "May 10", venue: "Loíza" },
    credit: "Breuss Arrizabalaga Quintet — Nfamoudou-Boudougou",
    songs: album("plenero", "Plenero de la Cresta", [
      "The Dark Side of Frigiliana",
      "Tsurugi",
      "Zubaida",
      "Pensamiento",
      "Mount Fuji",
      "They Dwell on Other Planes",
    ]),
  },
  {
    id: "buena-vista",
    name: "Buena Vista",
    photo: "/artists/buena-vista.webp",
    genres: ["Son", "Salsa", "Trova"],
    bio: "An ensemble keeping the golden-era Caribbean sound alive on stages across the island.",
    performing: { date: "May 9", venue: "Ponce" },
    credit: "Monplaisir — Le chant des Stompbox",
    songs: album("buena-vista", "Buena Vista", [
      "Ceci n'est pas un exercice",
      "Cette histoire n'a pas de fin",
      "Comme ces morceaux longs et chiants",
      "J'ai eu peur alors j'ai fui",
      "Tu vois le genre",
      "Une cathédrale au fond de mon sac",
    ]),
  },
  {
    id: "control-machete",
    name: "Control Machete",
    photo: "/artists/control-machete.webp",
    genres: ["Hip-hop", "Latin", "Rap"],
    bio: "Pioneers of Latin hip-hop with a raw, unmistakable sound.",
    performing: { date: "May 12", venue: "Mayagüez" },
    credit: "Holizna — City Slacker",
    songs: album("control-machete", "Control Machete", [
      "Busking in the Sunlight",
      "Bus Stop",
      "Busted AC Unit",
      "Nowhere to Be, Nothing to Do",
      "Hooptie with the Windows Down",
      "Fresh Fit",
    ]),
  },
];

export const events: MusicEvent[] = [
  {
    id: "feria-del-vinilo",
    title: "Feria del vinilo",
    poster: "/events/feria-del-vinilo.webp",
    date: "May 7",
    venue: "Aguadilla",
    description:
      "A powerful homecoming concert in Puerto Rico. Music, passion and protest — expect an electric atmosphere filled with pride, unity and raw energy.",
    lineup: ["residente", "tony-croatto", "ile"],
  },
  {
    id: "feria-de-vida",
    title: "Feria de Vida",
    poster: "/events/feria-de-vida.webp",
    date: "May 9",
    venue: "Santurce",
    description:
      "A day of bomba, plena and son under the open sky — the island's living traditions, on one stage.",
    lineup: ["buena-vista", "plenero", "tony-croatto"],
  },
  {
    id: "concierto-de-guitarra",
    title: "Concierto de Guitarra",
    poster: "/events/concierto-de-guitarra.webp",
    date: "May 11",
    venue: "Ponce",
    description:
      "An intimate evening of strings and song, celebrating the guitar across genres and generations.",
    lineup: ["ile", "control-machete", "residente"],
  },
  {
    id: "concierto-soledad",
    title: "Concierto Soledad",
    poster: "/events/concierto-soledad.webp",
    date: "May 13",
    venue: "Rincón",
    description:
      "A stripped-back, candle-lit set by the sea — just voices, strings, and the night.",
    lineup: ["ile", "tony-croatto"],
  },
  {
    id: "el-banquito",
    title: "El Banquito",
    poster: "/events/el-banquito.webp",
    date: "May 15",
    venue: "Cabo Rojo",
    description:
      "The neighborhood block party that became a festival — local acts, food, and dancing till late.",
    lineup: ["plenero", "buena-vista"],
  },
  {
    id: "raices-del-sol",
    title: "Raíces del Sol",
    poster: "/events/raices-del-sol.webp",
    date: "May 17",
    venue: "Fajardo",
    description:
      "A celebration of the island's roots — where hip-hop, bomba and son meet at sundown.",
    lineup: ["residente", "control-machete", "plenero"],
  },
  {
    id: "sesion-nocturna",
    title: "Sesión Nocturna",
    poster: "/events/sesion-nocturna.webp",
    date: "May 20",
    venue: "Viejo San Juan",
    description:
      "Late-night sets in a candlelit courtyard — a minimal stage, maximum atmosphere.",
    lineup: ["ile", "residente"],
  },
];

export function getArtist(id: string): Artist | undefined {
  return artists.find((a) => a.id === id);
}

export function getEvent(id: string): MusicEvent | undefined {
  return events.find((e) => e.id === id);
}
