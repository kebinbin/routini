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
      heroAlt:
        "Sona's Artists feed — activity sidebar, near-you artist grid, and the persistent player, all routed with routini.",
      videos: {
        discoverLenses:
          "Cycling through the Artists lens's Immersive, Compact, and Grid layouts, then switching to the Events and Map lenses — each one is a route, so the address bar changes right along with the view.",
        persistentPlayer:
          "Feed → artist → event: two shared-element transitions back to back, driven by nothing but a matching view-transition-name on each pair of pages, while the track underneath keeps playing the whole time.",
        mapUrlSync:
          "Hovering a pin to open its popup, then panning and zooming the map — the URL keeps pace with lat, lng, and z on every move, and the Leaflet instance underneath is never torn down or rebuilt.",
      },
      sections: {
        routes: {
          title: "One routes array, eager where it counts",
          body: "All of Sona's routing lives in one typed array. The Artists feed is eager, so the first paint is instant; everything else — Events, Map, the artist and event pages, even 404 — is a lazy import, so it ships as its own chunk and only downloads when you actually visit it. Artists, Events, and Map read like three lenses over one dataset, but each is a real route: switching between them is routini matching a new path, not a tab index held in state.",
          videoIntro:
            "That segmented control is what's playing below: Artists sorted by (simulated) distance and switchable between Immersive, Compact, and Grid layouts; Events, one card per upcoming show; and Map, those same events placed geographically. Try it on the live demo — click Artists, Events, and Map and watch the address bar: each one is a real route, so the URL changes every time. Then try the browser's Back and Forward buttons: routini picks the change up from popstate and swaps the matched page inside the <Outlet> right along with it.",
        },
        layout: {
          title: "A layout with a persistent player",
          body: "Router's children don't have to be routes — they can be a layout. Sona's AppLayout renders a single <Outlet> for the matched page, but the audio player and navigation sit outside it. That's the whole trick behind playback surviving navigation: the <audio> element is never inside the part of the tree that swaps out. The same layout also reads useLocation() to drop the \"For you\" sidebar and go full-width on a couple of routes — reactive for free, since AppLayout already re-renders on every navigation.",
        },
        preloadVt: {
          title: "Preload and View Transitions, used where they earn it",
          body: 'Every card in the feed pairs preload="hover" with viewTransition: hovering warms the artist page\'s chunk, and clicking morphs the photo, name and distance straight into the hero — no animation library, just a matching view-transition-name on both pages. The same pairing carries over anywhere else a poster or an artist photo is clickable, including the map\'s popups and the events grid. Plain navigation links (the top nav, the lens switcher, the bottom tab bar) only get preload — and so, deliberately, do the circular avatars in the "For you" activity feed: a circle has no clean shared-element morph into the feed\'s rectangular artwork, so there\'s no view-transition-name to give it.',
          videoIntro:
            "The clip below is that trick end to end: a track keeps playing while the app navigates from the feed to an artist page, then on to one of their events. Both hops are shared-element View Transitions — the feed photo morphing into the artist hero, then the event's poster art morphing into its own hero — and the audio never drops, because the player never left the tree.",
        },
        params: {
          title: "Typed params for deep-linkable pages",
          body: "The artist and event pages read their id straight from the URL and look up the record themselves — no props passed down from a list, no route-level data loader. That's what makes them work identically whether you clicked into one from the feed or opened the link directly.",
        },
        scrollRestoration: {
          title: "Scroll position that survives Back",
          body: "AppLayout scrolls its own <main>, not the window, so Router needs scrollContainer pointed at that element instead of the default window scroll. With scrollRestoration on, every forward navigation — switching lenses, opening an artist or event — starts at the top of the new page. But hitting Back from a detail page lands exactly where the list was left, scroll position included, not back at the top.",
        },
        searchParams: {
          title: "Shareable map state",
          body: "The map's most interesting routini usage: center and zoom live in the URL (?lat&lng&z), written on every pan with replace so ten drags don't bury the Back button in history. The subtle part is what doesn't happen — routini's location store tracks the pathname only, so writing the query string never remounts the route, and the (expensive) Leaflet map is never torn down while you're panning it.",
          videoIntro:
            "Below, a pin on the map opens a themed popup built from the same card used in the feed and the events grid — hover a venue hosting more than one show and a small ‹ 1/2 › control steps through them in place. Then watch the address bar while panning and zooming: lat, lng, and z rewrite on every move, and the map itself never blinks, because routini never remounted it underneath.",
        },
        redirect: {
          title: "A safe default redirect",
          body: "/ redirects straight to /artists. <Navigate> replaces the history entry by default specifically so this doesn't create a back-button trap — without it, hitting Back from the feed would bounce you right back to the redirect and forward again.",
        },
        resilience: {
          title: "Every lazy route is already protected",
          body: "routini wraps every route — Sona's nine, seven of them lazy — in an error boundary automatically, so a chunk that fails to download after a deploy gets a fallback instead of a white screen. That much costs nothing. Sona goes one step further and passes its own errorFallback: a function receiving the error plus reset, reload and isChunkError, so a failed chunk offers a reload (the only thing that fixes a stale deploy) while a render error offers an in-place retry that keeps playback and app state alive.",
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
      heroAlt:
        "El feed de Artistas de Sona — barra de actividad, grilla de artistas cercanos y el reproductor persistente, todo enrutado con routini.",
      videos: {
        discoverLenses:
          "Recorriendo las vistas Inmersiva, Compacta y Grilla de la lente Artistas, y luego cambiando a las lentes Eventos y Mapa — cada una es una ruta, así que la barra de direcciones cambia junto con la vista.",
        persistentPlayer:
          "Feed → artista → evento: dos View Transitions de elemento compartido una tras otra, impulsadas solo por un view-transition-name coincidente en cada par de páginas, mientras la canción de fondo sigue sonando todo el tiempo.",
        mapUrlSync:
          "Pasar el cursor sobre un pin para abrir su popup, y luego desplazar y hacer zoom en el mapa — la URL se mantiene al día con lat, lng y z en cada movimiento, y la instancia de Leaflet debajo nunca se destruye ni se reconstruye.",
      },
      sections: {
        routes: {
          title: "Un solo array de rutas, eager donde importa",
          body: "Todo el enrutamiento de Sona vive en un array tipado. El feed de Artistas es eager, así que el primer render es instantáneo; todo lo demás — Eventos, Mapa, las páginas de artista y evento, hasta el 404 — es un import lazy, así que se empaqueta en su propio chunk y solo se descarga cuando realmente lo visitas. Artistas, Eventos y Mapa se leen como tres lentes sobre un mismo dataset, pero cada una es una ruta real: cambiar entre ellas es routini emparejando un nuevo path, no un índice de pestaña guardado en el estado.",
          videoIntro:
            "Ese control segmentado es justo lo que se reproduce abajo: Artistas ordenados por distancia (simulada) y alternable entre vistas Inmersiva, Compacta y Grilla; Eventos, una tarjeta por cada show próximo; y Mapa, esos mismos eventos ubicados geográficamente. Probá esto en la demo en vivo — hacé clic en Artistas, Eventos y Mapa y mirá la barra de direcciones: cada una es una ruta real, así que la URL cambia cada vez. Después probá los botones Atrás y Adelante del navegador: routini detecta el cambio con popstate y actualiza la página que coincide dentro del <Outlet> junto con él.",
        },
        layout: {
          title: "Un layout con un reproductor persistente",
          body: "Los children de Router no tienen que ser rutas — pueden ser un layout. El AppLayout de Sona renderiza un solo <Outlet> para la página que coincide, pero el reproductor de audio y la navegación quedan fuera de él. Ese es todo el truco detrás de que la reproducción sobreviva la navegación: el elemento <audio> nunca está dentro de la parte del árbol que se reemplaza. Ese mismo layout también usa useLocation() para quitar la barra lateral \"Para ti\" y pasar a ancho completo en un par de rutas — reactivo gratis, ya que AppLayout de todos modos se vuelve a renderizar en cada navegación.",
        },
        preloadVt: {
          title: "Preload y View Transitions, usados donde valen la pena",
          body: 'Cada tarjeta del feed combina preload="hover" con viewTransition: pasar el cursor precarga el chunk de la página del artista, y hacer clic transforma la foto, el nombre y la distancia directamente en el hero — sin librería de animación, solo un view-transition-name coincidente en ambas páginas. La misma combinación se repite en cualquier otro lugar donde un póster o una foto de artista sea clickeable, incluyendo los popups del mapa y la grilla de eventos. Los enlaces de navegación simples (el nav superior, el selector de lentes, la barra inferior) solo llevan preload — y, deliberadamente, también los avatares circulares del feed de actividad "Para ti": un círculo no tiene una transformación limpia de elemento compartido hacia el arte rectangular del feed, así que no hay view-transition-name que darle.',
          videoIntro:
            "El clip de abajo es ese truco de principio a fin: una canción sigue sonando mientras la app navega del feed a la página de un artista, y de ahí a uno de sus eventos. Ambos saltos son View Transitions de elemento compartido — la foto del feed transformándose en el hero del artista, y luego el póster del evento transformándose en el suyo — y el audio nunca se corta, porque el reproductor nunca salió del árbol.",
        },
        params: {
          title: "Params tipados para páginas enlazables",
          body: "Las páginas de artista y evento leen su id directamente de la URL y buscan el registro por sí mismas — sin props pasadas desde una lista, sin un data loader a nivel de ruta. Eso es lo que hace que funcionen igual sin importar si entraste desde el feed o abriste el enlace directamente.",
        },
        scrollRestoration: {
          title: "Posición de scroll que sobrevive a Atrás",
          body: "El AppLayout de Sona desplaza su propio <main>, no la ventana, así que Router necesita que scrollContainer apunte a ese elemento en vez del scroll de ventana por defecto. Con scrollRestoration activado, cada navegación hacia adelante — cambiar de lente, abrir un artista o un evento — arranca en la parte superior de la nueva página. Pero presionar Atrás desde una página de detalle aterriza exactamente donde quedó la lista, posición de scroll incluida, no de vuelta arriba.",
        },
        searchParams: {
          title: "Estado del mapa, compartible",
          body: "El uso más interesante de routini en el mapa: el centro y el zoom viven en la URL (?lat&lng&z), escritos en cada movimiento con replace para que diez arrastres no llenen el historial y entierren el botón de Atrás. Lo sutil es lo que no pasa — el store de ubicación de routini rastrea solo el pathname, así que escribir el query string nunca vuelve a montar la ruta, y el mapa de Leaflet (costoso de recrear) nunca se destruye mientras lo mueves.",
          videoIntro:
            "Abajo, un pin en el mapa abre un popup con tema construido a partir de la misma tarjeta usada en el feed y en la grilla de eventos — pasar el cursor sobre un recinto con más de un show muestra un pequeño control ‹ 1/2 › para recorrerlos en el sitio. Luego observa la barra de direcciones mientras se desplaza y hace zoom: lat, lng y z se reescriben en cada movimiento, y el mapa mismo nunca parpadea, porque routini nunca lo volvió a montar por debajo.",
        },
        redirect: {
          title: "Una redirección segura por defecto",
          body: "/ redirige directamente a /artists. <Navigate> reemplaza la entrada del historial por defecto específicamente para que esto no cree una trampa de botón Atrás — sin eso, presionar Atrás desde el feed te devolvería directo a la redirección y de vuelta hacia adelante.",
        },
        resilience: {
          title: "Cada ruta lazy ya está protegida",
          body: "routini envuelve cada ruta — las nueve de Sona, siete de ellas lazy — en un error boundary automáticamente, así que un chunk que falla al descargarse después de un deploy recibe un fallback en vez de una pantalla en blanco. Eso no cuesta nada. Sona va un paso más allá y pasa su propio errorFallback: una función que recibe el error junto con reset, reload e isChunkError, de modo que un chunk fallido ofrece recargar (lo único que arregla un deploy desactualizado) mientras que un error de render ofrece un reintento en el sitio que mantiene vivos la reproducción y el estado de la app.",
        },
      },
    },
  },
} as const;

export function useSonaCaseStudyT() {
  return sonaCaseStudy[useLang()];
}
