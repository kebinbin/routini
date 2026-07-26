import { useLang } from "./i18n";

// Sona case-study page copy. Imported only by the lazy examples/sona route.
// Every code snippet shown on this page is a real excerpt from
// examples/music-player (see snippets.ts) — this page explains the "why"
// behind each one; section anchors key into `sections` below.
const sonaCaseStudy = {
  en: {
    sonaCaseStudy: {
      pretitle: "/examples/sona",
      title: "Sona.io",
      sub: "A music & event-discovery demo — built to put routini through its paces in something that feels like a real app, not a toy example. Here's how it actually uses each feature.",
      liveDemo: "Live demo",
      viewSource: "Source",
      sections: {
        routes: {
          title: "One routes array, eager where it counts",
          body: "All of Sona's routing lives in one typed array. The home feed is eager, so the first paint is instant; everything else — the map, the artist and event pages, even 404 — is a lazy import, so it ships as its own chunk and only downloads when you actually visit it.",
        },
        layout: {
          title: "A layout with a persistent player",
          body: "Router's children don't have to be routes — they can be a layout. Sona's AppLayout renders a single <Outlet> for the matched page, but the audio player and navigation sit outside it. That's the whole trick behind playback surviving navigation: the <audio> element is never inside the part of the tree that swaps out.",
        },
        preloadVt: {
          title: "Preload and View Transitions, used where they earn it",
          body: 'Every card in the feed pairs preload="hover" with viewTransition: hovering warms the artist page\'s chunk, and clicking morphs the photo, name and distance straight into the hero — no animation library, just a matching view-transition-name on both pages. Plain navigation links (the top nav, the bottom tab bar) only get preload — there\'s no shared element to animate, so there\'s no reason to ask for one.',
        },
        params: {
          title: "Typed params for deep-linkable pages",
          body: "The artist and event pages read their id straight from the URL and look up the record themselves — no props passed down from a list, no route-level data loader. That's what makes them work identically whether you clicked into one from the feed or opened the link directly.",
        },
        searchParams: {
          title: "Shareable map state",
          body: "The map's most interesting routini usage: center and zoom live in the URL (?lat&lng&z), written on every pan with replace so ten drags don't bury the Back button in history. The subtle part is what doesn't happen — routini's location store tracks the pathname only, so writing the query string never remounts the route, and the (expensive) Leaflet map is never torn down while you're panning it.",
        },
        redirect: {
          title: "A safe default redirect",
          body: "/ redirects straight to /artists. <Navigate> replaces the history entry by default specifically so this doesn't create a back-button trap — without it, hitting Back from the feed would bounce you right back to the redirect and forward again.",
        },
        resilience: {
          title: "Every lazy route is already protected",
          body: "routini wraps every route — Sona's eight of them, six of which are lazy — in an error boundary automatically. Sona doesn't customize it; a failed chunk after a bad deploy still gets a fallback instead of a white screen, for free, with zero code written for it.",
        },
      },
    },
  },
  es: {
    sonaCaseStudy: {
      pretitle: "/ejemplos/sona",
      title: "Sona.io",
      sub: "Una demo de descubrimiento de música y eventos — construida para poner a prueba routini en algo que se siente como una app real, no un ejemplo de juguete. Así es como usa cada función.",
      liveDemo: "Ver demo",
      viewSource: "Código",
      sections: {
        routes: {
          title: "Un solo array de rutas, eager donde importa",
          body: "Todo el enrutamiento de Sona vive en un array tipado. El feed principal es eager, así que el primer render es instantáneo; todo lo demás — el mapa, las páginas de artista y evento, hasta el 404 — es un import lazy, así que se empaqueta en su propio chunk y solo se descarga cuando realmente lo visitas.",
        },
        layout: {
          title: "Un layout con un reproductor persistente",
          body: "Los children de Router no tienen que ser rutas — pueden ser un layout. El AppLayout de Sona renderiza un solo <Outlet> para la página que coincide, pero el reproductor de audio y la navegación quedan fuera de él. Ese es todo el truco detrás de que la reproducción sobreviva la navegación: el elemento <audio> nunca está dentro de la parte del árbol que se reemplaza.",
        },
        preloadVt: {
          title: "Preload y View Transitions, usados donde valen la pena",
          body: 'Cada tarjeta del feed combina preload="hover" con viewTransition: pasar el cursor precarga el chunk de la página del artista, y hacer clic transforma la foto, el nombre y la distancia directamente en el hero — sin librería de animación, solo un view-transition-name coincidente en ambas páginas. Los enlaces de navegación simples (el nav superior, la barra inferior) solo llevan preload — no hay ningún elemento compartido que animar, así que no hay razón para pedirlo.',
        },
        params: {
          title: "Params tipados para páginas enlazables",
          body: "Las páginas de artista y evento leen su id directamente de la URL y buscan el registro por sí mismas — sin props pasadas desde una lista, sin un data loader a nivel de ruta. Eso es lo que hace que funcionen igual sin importar si entraste desde el feed o abriste el enlace directamente.",
        },
        searchParams: {
          title: "Estado del mapa, compartible",
          body: "El uso más interesante de routini en el mapa: el centro y el zoom viven en la URL (?lat&lng&z), escritos en cada movimiento con replace para que diez arrastres no llenen el historial y entierren el botón de Atrás. Lo sutil es lo que no pasa — el store de ubicación de routini rastrea solo el pathname, así que escribir el query string nunca vuelve a montar la ruta, y el mapa de Leaflet (costoso de recrear) nunca se destruye mientras lo mueves.",
        },
        redirect: {
          title: "Una redirección segura por defecto",
          body: "/ redirige directamente a /artists. <Navigate> reemplaza la entrada del historial por defecto específicamente para que esto no cree una trampa de botón Atrás — sin eso, presionar Atrás desde el feed te devolvería directo a la redirección y de vuelta hacia adelante.",
        },
        resilience: {
          title: "Cada ruta lazy ya está protegida",
          body: "routini envuelve cada ruta — las ocho de Sona, seis de ellas lazy — en un error boundary automáticamente. Sona no lo personaliza; un chunk que falla después de un mal deploy igual recibe un fallback en vez de una pantalla en blanco, gratis, sin una sola línea de código escrita para eso.",
        },
      },
    },
  },
} as const;

export function useSonaCaseStudyT() {
  return sonaCaseStudy[useLang()];
}
