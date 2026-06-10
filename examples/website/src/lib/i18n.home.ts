import { useLang } from "./i18n";

// Landing-page copy. Home is an eager route, so this loads in the initial
// bundle alongside it (used by Home + Hero/WhyRoutini/ApiAtAGlance/BuiltWith).
const home = {
  en: {
    home: {
      pretitle: "A tiny router for React",
      title1: "Routing.",
      title2: "Nothing else.",
      sub: "2.3 KB gzipped. TypeScript-first. Lazy routes built in.",
      ctaDocs: "Read the docs",
      ctaGithub: "View on GitHub",
    },
    why: {
      pretitle: "Small on purpose",
      subhead:
        "Small to ship, solid to type, scoped to one job, free of setup ceremony.",
      size: {
        headline: "2.3 KB gzipped",
        body: "Components, hooks, and the navigate utility — the whole library is 2.3 KB gzipped.",
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
    api: {
      pretitle: "API at a glance",
      intro: "Seven exports and one utility — the whole API fits in your head.",
      entries: [
        {
          name: "Router",
          anchor: "router",
          desc: "Root config wrapper. Pass a routes array and/or <Route> children.",
        },
        {
          name: "Route",
          anchor: "route",
          desc: "JSX form of a route definition. Renders null; matched by Router via Symbol.",
        },
        {
          name: "Link",
          anchor: "link",
          desc: "Client-side navigation. Respects cmd-click, target, and modifier keys.",
        },
        {
          name: "Outlet",
          anchor: "outlet",
          desc: "Renders the matched page inside a layout. Optional.",
        },
        {
          name: "Navigate",
          anchor: "navigate-component",
          desc: "Declarative redirect. Mounts → calls navigate(to).",
        },
        {
          name: "useLocation",
          anchor: "use-location",
          desc: "Hook → { path, navigate }. Re-renders on URL change.",
        },
        {
          name: "useParams",
          anchor: "use-params",
          desc: "Hook → typed route params. Generic: useParams<T>().",
        },
        {
          name: "navigate",
          anchor: "navigate-util",
          desc: "Imperative navigation utility. Use outside components or in event handlers.",
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
      sub: "2.3 KB gzipped. TypeScript-first. Carga diferida integrada.",
      ctaDocs: "Leer la documentación",
      ctaGithub: "Ver en GitHub",
    },
    why: {
      pretitle: "Pequeño a propósito",
      subhead:
        "Ligera al enviar, robusta en tipado, enfocada en una sola tarea, sin ceremonia de configuración.",
      size: {
        headline: "2.3 KB gzipped",
        body: "Componentes, hooks y la utilidad navigate — toda la librería pesa 2.3 KB comprimida.",
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
    api: {
      pretitle: "La API de un vistazo",
      intro: "Siete exports y una utilidad — y con eso conoces toda la API.",
      entries: [
        {
          name: "Router",
          anchor: "router",
          desc: "Wrapper de configuración raíz. Acepta un array de rutas y/o hijos <Route>.",
        },
        {
          name: "Route",
          anchor: "route",
          desc: "Forma JSX de una definición de ruta. Renderiza null; Router la detecta mediante un Symbol.",
        },
        {
          name: "Link",
          anchor: "link",
          desc: "Navegación en cliente. Respeta cmd-click, target y teclas modificadoras.",
        },
        {
          name: "Outlet",
          anchor: "outlet",
          desc: "Renderiza la página coincidente dentro de un layout. Opcional.",
        },
        {
          name: "Navigate",
          anchor: "navigate-component",
          desc: "Redirección declarativa. Al montar → llama a navigate(to).",
        },
        {
          name: "useLocation",
          anchor: "use-location",
          desc: "Hook → { path, navigate }. Re-renderiza al cambiar la URL.",
        },
        {
          name: "useParams",
          anchor: "use-params",
          desc: "Hook → params tipados. Genérico: useParams<T>().",
        },
        {
          name: "navigate",
          anchor: "navigate-util",
          desc: "Utilidad imperativa. Útil fuera de componentes o en event handlers.",
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
