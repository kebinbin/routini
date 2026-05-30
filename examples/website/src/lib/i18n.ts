import { useParams } from "routini";

export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

export function isLang(value: unknown): value is Lang {
  return (
    typeof value === "string" && (LANGS as readonly string[]).includes(value)
  );
}

const dict = {
  en: {
    nav: {
      docs: "docs",
      examples: "examples",
      github: "GitHub",
    },
    home: {
      pretitle: "A tiny router for React",
      title1: "Routing.",
      title2: "Nothing else.",
      sub: "Under 2 KB. TypeScript-first. Lazy routes built in.",
      ctaDocs: "Read the docs",
      ctaGithub: "View on GitHub",
      copyInstall: "Copy install command",
      copied: "Copied",
    },
    why: {
      pretitle: "Small on purpose",
      subhead:
        "Small to ship, solid to type, scoped to one job, free of setup ceremony.",
      size: {
        headline: "Under 2 KB",
        body: "Components, hooks, and the navigate utility — the whole library ships in 1.4 KB gzipped.",
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
    quickStart: {
      pretitle: "Quick start",
      intro:
        "Define a routes array, render <Router />, link with <Link />. That's the whole mental model.",
      captions: {
        setup: "Setup",
        routeChildren: "<Route> JSX children",
        lazyRoutes: "Lazy routes",
        typedParams: "Typed URL params",
        navigateFromCode: "Navigate from code",
        currentPath: "Current path",
      },
    },
    api: {
      pretitle: "API at a glance",
      intro:
        "Seven exports, one utility. Each links to its full reference in the docs.",
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
    docs: {
      pretitle: "/docs",
      title: "API reference",
      sub: "Coming next: a section per export with examples, types, and usage notes.",
    },
    examples: {
      pretitle: "/examples",
      title: "Annotated examples",
      sub: "Coming next: runnable patterns with explained code samples.",
    },
    notFound: {
      pretitle: "404",
      title: "No route matched.",
      sub: "The URL didn't match any of the routes defined in this site.",
      home: "Back home",
    },
    footer: {
      builtWith: "built with",
    },
  },
  es: {
    nav: {
      docs: "docs",
      examples: "ejemplos",
      github: "GitHub",
    },
    home: {
      pretitle: "Un router pequeño para React",
      title1: "Solo routing.",
      title2: "Nada más.",
      sub: "Menos de 2 KB. TypeScript-first. Carga diferida integrada.",
      ctaDocs: "Leer la documentación",
      ctaGithub: "Ver en GitHub",
      copyInstall: "Copiar comando de instalación",
      copied: "Copiado",
    },
    why: {
      pretitle: "Pequeño a propósito",
      subhead:
        "Ligera al enviar, robusta en tipado, enfocada en una sola tarea, sin ceremonia de configuración.",
      size: {
        headline: "Menos de 2 KB",
        body: "Componentes, hooks y la utilidad navigate — toda la librería pesa 1.4 KB comprimida.",
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
    quickStart: {
      pretitle: "Inicio rápido",
      intro:
        "Define un array de rutas, renderiza <Router />, navega con <Link />. Ese es todo el modelo mental.",
      captions: {
        setup: "Setup",
        routeChildren: "<Route> como hijos JSX",
        lazyRoutes: "Rutas con carga diferida",
        typedParams: "Params tipados",
        navigateFromCode: "Navegar desde código",
        currentPath: "Ruta actual",
      },
    },
    api: {
      pretitle: "La API de un vistazo",
      intro:
        "Siete exports y una utilidad. Cada uno enlaza a su referencia completa en la documentación.",
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
    docs: {
      pretitle: "/docs",
      title: "Referencia del API",
      sub: "Próximamente: una sección por export con ejemplos, tipos y notas de uso.",
    },
    examples: {
      pretitle: "/ejemplos",
      title: "Ejemplos comentados",
      sub: "Próximamente: patrones ejecutables con código explicado.",
    },
    notFound: {
      pretitle: "404",
      title: "Ninguna ruta coincide.",
      sub: "La URL no coincide con ninguna ruta definida en este sitio.",
      home: "Volver al inicio",
    },
    footer: {
      builtWith: "hecho con",
    },
  },
} as const;

export type Dict = (typeof dict)[Lang];

export function useLang(): Lang {
  const { lang } = useParams<{ lang?: string }>();
  return isLang(lang) ? lang : DEFAULT_LANG;
}

export function useT(): Dict {
  return dict[useLang()];
}

/** Build a route path with the current language prefix, e.g. langPath("en", "/docs") → "/en/docs" */
export function langPath(lang: Lang, path: string = ""): string {
  if (!path || path === "/") return `/${lang}`;
  return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
}
