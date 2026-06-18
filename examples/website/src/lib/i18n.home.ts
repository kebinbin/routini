import { useLang } from "./i18n";

// Landing-page copy. Home is an eager route, so this loads in the initial
// bundle alongside it (used by Home + Hero/WhyRoutini/BuiltIn/BuiltWith).
const home = {
  en: {
    home: {
      pretitle: "A tiny router for React",
      title1: "Routing.",
      title2: "Nothing else.",
      sub: "2.8 KB gzipped. TypeScript-first. Lazy routes built in.",
      ctaDocs: "Read the docs",
      ctaGithub: "View on GitHub",
    },
    why: {
      pretitle: "Small on purpose",
      subhead:
        "Small to ship, solid to type, scoped to one job, free of setup ceremony.",
      size: {
        headline: "2.8 KB gzipped",
        body: "Components, hooks, and the navigate utility — the whole library is 2.8 KB gzipped.",
      },
      types: {
        headline: "TypeScript from day one",
        body: "Written in TypeScript, not retrofitted. useParams<T>() is generic and every export is fully typed.",
      },
      scope: {
        headline: "Routing, not a framework",
        body: "routini matches URLs to components — nothing more. Your data layer — SWR, React Query, fetch — stays yours.",
      },
      config: {
        headline: "Zero configuration",
        body: "No config file, no codegen, no Vite plugin. Install, define a routes array, and you're done.",
      },
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
        "We're pre-launch. When you ship something with routini, send a PR — we'll feature it here.",
      placeholder: "Your project here",
      cta: "Add yours →",
    },
  },
  es: {
    home: {
      pretitle: "Un router pequeño para React",
      title1: "Solo routing.",
      title2: "Nada más.",
      sub: "2.8 KB gzipped. TypeScript-first. Carga diferida integrada.",
      ctaDocs: "Leer la documentación",
      ctaGithub: "Ver en GitHub",
    },
    why: {
      pretitle: "Pequeño a propósito",
      subhead:
        "Ligera al enviar, robusta en tipado, enfocada en una sola tarea, sin ceremonia de configuración.",
      size: {
        headline: "2.8 KB gzipped",
        body: "Componentes, hooks y la utilidad navigate — toda la librería pesa 2.8 KB comprimida.",
      },
      types: {
        headline: "TypeScript desde el primer día",
        body: "Escrita en TypeScript, no añadida después. useParams<T>() es genérico y cada export está completamente tipado.",
      },
      scope: {
        headline: "Routing, no un framework",
        body: "routini empareja URLs con componentes — nada más. Tu capa de datos — SWR, React Query, fetch — sigue siendo tuya.",
      },
      config: {
        headline: "Cero configuración",
        body: "Sin archivo de configuración, sin codegen, sin plugin de Vite. Instala, define un array de rutas y listo.",
      },
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
      intro:
        "Estamos en pre-lanzamiento. Cuando publiques algo con routini, abre un PR — lo destacaremos aquí.",
      placeholder: "Tu proyecto aquí",
      cta: "Añade el tuyo →",
    },
  },
} as const;

export function useHomeT() {
  return home[useLang()];
}
