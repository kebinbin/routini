import { useLang } from "./i18n";

// Landing-page copy. Home is an eager route, so this loads in the initial
// bundle alongside it (used by Home + Highlights/Bundle/BuiltIn/BuiltWith).
const home = {
  en: {
    home: {
      pretitle: "A tiny router for React",
      title1: "Just routing, not",
      title2: "much more than that.",
      sub: "A tiny router with the syntax you already know, and the features you need — Lazy, code-split routes. View Transitions and error recovery built in. Made for those who want to ship a React app without adopting a whole framework.",
      ctaDocs: "Read the docs",
    },
    highlights: {
      pretitle: "Self-contained",
      heading: "Add it, don't adopt it.",
      sub: "Start routing in minutes, and keep the rest of your stack exactly as it is.",
      items: [
        {
          name: "Just routing",
          desc: "A minimal library that covers the routing essentials, not a framework. Bring your own data fetching, state, and build.",
        },
        {
          name: "Effortless",
          desc: "A small, familiar API and zero config — a routes array and you're running. If you know React, you already know routini.",
        },
        {
          name: "Fast",
          desc: "Built with performance in mind — lazy, code-split routes, link preloading, and a tiny runtime that stays out of the way.",
        },
      ],
    },
    bundle: {
      pretitle: "Small on purpose",
      headline: "Tiny by design.",
      sub: "Small to ship, scoped to one job, free of setup ceremony — the whole router in 3.2 KB gzipped, with zero runtime dependencies.",
      compare:
        "routini is scoped to routing, so it stays small. The bigger routers add loaders, type-safe routes, and SSR for when you need them.",
    },
    builtIn: {
      pretitle: "Built in",
      intro: "Small, but not stripped — the essentials ship in the box.",
      entries: [
        // Row 1 — perf headline, then the route the user hits next, then the
        // tall "use it your way" card.
        {
          name: "Lazy + code-split routes",
          anchor: "route",
          desc: "Mark a route lazy and routini wraps it in Suspense — each page ships as its own chunk.",
        },
        {
          name: "Link preload",
          anchor: "preloading",
          desc: "Warm a route's chunk on hover, on render, or when it scrolls into view, so the next page lands instantly.",
        },
        {
          name: "Declarative or imperative",
          anchor: "router",
          desc: "Describe routing with JSX — <Route>, <Link> — or drive it from code — a routes array, navigate(). Your call, for routes and navigation alike.",
        },
        // Row 2 — app structure / resilience
        {
          name: "Layouts with Outlet",
          anchor: "outlet",
          desc: "Wrap pages in a shared layout; <Outlet/> renders the matched page inside it.",
        },
        {
          name: "Error boundary",
          anchor: "error-handling",
          desc: "A failed chunk or a render error shows a fallback instead of white-screening the app.",
        },
        // Row 3 — the wide showcase, lower down
        {
          name: "View Transitions",
          anchor: "view-transitions",
          desc: "Animate any navigation — forward and back — with the platform View Transitions API.",
        },
        {
          name: "Redirects",
          anchor: "navigate-component",
          desc: "Send visitors from a guarded route to /login with <Navigate> — it replaces by default, so Back never bounces them into the redirect again.",
        },
        // Row 4 — reading the URL, fundamentals last
        {
          name: "Route & search params",
          anchor: "use-params",
          desc: "Read path segments with useParams() and the ?query with useSearchParams() — values straight off the URL, both reactive, no prop drilling.",
        },
        {
          name: "useLocation",
          anchor: "use-location",
          desc: "Read the current path with useLocation() to highlight the active link; it re-renders on every navigation.",
        },
        {
          name: "Hash-anchor scrolling",
          anchor: "link",
          desc: "Links to #sections scroll into view smoothly, and keep working on lazy routes.",
        },
      ],
    },
    builtWith: {
      pretitle: "Built with routini",
      intro:
        "Shipped something with routini? Send a PR — we'll feature it here.",
      placeholder: "Your project here",
      cta: "Add yours →",
    },
  },
  es: {
    home: {
      pretitle: "Un router pequeño para React",
      title1: "Solo routing, no",
      title2: "mucho más que eso.",
      sub: "Un router pequeño con la sintaxis que ya conoces, y las funciones que necesitas — rutas lazy y divididas por código. Incluye View Transitions y recuperación de errores. Pensado para quienes quieren lanzar una app de React sin adoptar un framework completo.",
      ctaDocs: "Leer la documentación",
    },
    highlights: {
      pretitle: "Autocontenida",
      heading: "Añádelo, no lo adoptes.",
      sub: "Empieza a enrutar en minutos y deja el resto de tu stack tal como está.",
      items: [
        {
          name: "Solo routing",
          desc: "Una librería mínima que cubre lo esencial del routing, no un framework. Maneja tú el fetching de datos, el estado y el build.",
        },
        {
          name: "Sin esfuerzo",
          desc: "Una API pequeña y familiar, cero configuración — un array de rutas y a funcionar. Si sabes React, ya sabes routini.",
        },
        {
          name: "Rápida",
          desc: "Construida pensando en el rendimiento — rutas lazy con code-splitting, preload de enlaces y un runtime diminuto que no estorba.",
        },
      ],
    },
    bundle: {
      pretitle: "Pequeño a propósito",
      headline: "Diminuto por diseño.",
      sub: "Ligera al enviar, enfocada en una sola tarea, sin ceremonia — todo el router en 3.2 KB comprimido, con cero dependencias en runtime.",
      compare:
        "routini se enfoca en el routing, por eso es pequeña. Los routers grandes añaden loaders, rutas tipadas y SSR para cuando los necesitas.",
    },
    builtIn: {
      pretitle: "Incluido",
      intro: "Pequeña, pero no recortada — lo esencial viene de fábrica.",
      entries: [
        // Fila 1 — titular de rendimiento, la ruta siguiente, y la tarjeta alta.
        {
          name: "Rutas lazy + code-splitting",
          anchor: "route",
          desc: "Marca una ruta como lazy y routini la envuelve en Suspense — cada página viaja en su propio chunk.",
        },
        {
          name: "Preload de enlaces",
          anchor: "preloading",
          desc: "Precalienta el chunk de una ruta al pasar el cursor, al montar o al entrar en pantalla, para que la siguiente página sea instantánea.",
        },
        {
          name: "Declarativo o imperativo",
          anchor: "router",
          desc: "Describe el routing con JSX — <Route>, <Link> — o contrólalo desde código — un array de rutas, navigate(). Tú eliges, tanto para rutas como para navegación.",
        },
        // Fila 2 — estructura de la app / resiliencia
        {
          name: "Layouts con Outlet",
          anchor: "outlet",
          desc: "Envuelve páginas en un layout compartido; <Outlet/> renderiza dentro la página coincidente.",
        },
        {
          name: "Error boundary",
          anchor: "error-handling",
          desc: "Un chunk fallido o un error de render muestra un fallback en vez de dejar la app en blanco.",
        },
        // Fila 3 — el showcase ancho, más abajo
        {
          name: "View Transitions",
          anchor: "view-transitions",
          desc: "Anima cualquier navegación — hacia delante y atrás — con la API de View Transitions del navegador.",
        },
        {
          name: "Redirecciones",
          anchor: "navigate-component",
          desc: "Envía a los visitantes de una ruta protegida a /login con <Navigate> — reemplaza por defecto, así Atrás nunca los devuelve al redirect.",
        },
        // Fila 4 — leer la URL, fundamentos al final
        {
          name: "Params de ruta y search",
          anchor: "use-params",
          desc: "Lee segmentos del path con useParams() y el ?query con useSearchParams() — valores directos de la URL, ambos reactivos, sin prop drilling.",
        },
        {
          name: "useLocation",
          anchor: "use-location",
          desc: "Lee la ruta actual con useLocation() para resaltar el enlace activo; se re-renderiza en cada navegación.",
        },
        {
          name: "Scroll a anclas #hash",
          anchor: "link",
          desc: "Los enlaces a #secciones hacen scroll suave y siguen funcionando en rutas lazy.",
        },
      ],
    },
    builtWith: {
      pretitle: "Hecho con routini",
      intro: "¿Publicaste algo con routini? Abre un PR — lo destacaremos aquí.",
      placeholder: "Tu proyecto aquí",
      cta: "Añade el tuyo →",
    },
  },
} as const;

export function useHomeT() {
  return home[useLang()];
}
