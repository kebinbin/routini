import { useLang } from "./i18n";

// Examples-page copy. Imported only by the lazy Examples route. Recipe titles
// + bodies are translated here; the anchor → snippet mapping is code-side in
// Examples.tsx (RECIPES).
const examples = {
  en: {
    examples: {
      pretitle: "/examples",
      title: "Examples",
      sub: "Copy-paste recipes for common patterns, plus full apps built with routini.",
      appsTitle: "Full apps",
      appsIntro:
        "Complete apps built with routini — open the live demo or read the source.",
      comingSoon: "Coming soon",
      liveDemo: "Live demo",
      viewSource: "Source",
      recipes: {
        "basic-app": {
          title: "A basic app",
          body: "Define your routes, render <Router />, and link between pages with <Link />. That's the whole setup — no provider, no config file.",
        },
        "code-split": {
          title: "Code-split routes",
          body: "Mark any route lazy and routini wraps it in Suspense for you. Keep the landing route eager, split the rest, and give slow chunks a per-route fallback.",
        },
        "typed-params": {
          title: "Typed params + your data layer",
          body: "Read URL params with useParams<T>() and hand the id to whatever you fetch with — SWR, React Query, fetch. routini gives you the route; your data layer does the rest.",
        },
        "active-nav": {
          title: "Layout with an active nav",
          body: "Wrap your pages in a layout with <Outlet />, and use useLocation() to mark the current link. One small NavLink handles highlight state for the whole nav.",
        },
        "redirects-404": {
          title: "Redirects & 404",
          body: 'Redirect from a route with <Navigate />, and catch everything else with a "*" route. Both live in the same routes array.',
        },
        "programmatic-nav": {
          title: "Navigate from code",
          body: "Call navigate() from an event handler or anywhere outside a component — after a form submit, a logout, a timeout. No hook required.",
        },
      },
      apps: [
        {
          name: "Music player",
          blurb: "A player UI with routed views — library, album, playlist.",
        },
        {
          name: "Shop",
          blurb: "An e-commerce front end — product grid, detail pages, cart.",
        },
      ],
    },
  },
  es: {
    examples: {
      pretitle: "/ejemplos",
      title: "Ejemplos",
      sub: "Recetas para copiar y pegar de patrones comunes, además de apps completas hechas con routini.",
      appsTitle: "Apps completas",
      appsIntro:
        "Apps completas hechas con routini — abre la demo o lee el código.",
      comingSoon: "Próximamente",
      liveDemo: "Ver demo",
      viewSource: "Código",
      recipes: {
        "basic-app": {
          title: "Una app básica",
          body: "Define tus rutas, renderiza <Router /> y enlaza entre páginas con <Link />. Esa es toda la configuración — sin provider, sin archivo de config.",
        },
        "code-split": {
          title: "Rutas con code-splitting",
          body: "Marca cualquier ruta como lazy y routini la envuelve en Suspense por ti. Deja la landing eager, divide el resto y dale a los chunks lentos un fallback por ruta.",
        },
        "typed-params": {
          title: "Params tipados + tu capa de datos",
          body: "Lee los params de la URL con useParams<T>() y pasa el id a lo que uses para fetch — SWR, React Query, fetch. routini te da la ruta; tu capa de datos hace el resto.",
        },
        "active-nav": {
          title: "Layout con nav activa",
          body: "Envuelve tus páginas en un layout con <Outlet /> y usa useLocation() para marcar el enlace actual. Un pequeño NavLink cubre el estado activo de toda la nav.",
        },
        "redirects-404": {
          title: "Redirecciones y 404",
          body: 'Redirige desde una ruta con <Navigate /> y captura todo lo demás con una ruta "*". Ambas viven en el mismo array de rutas.',
        },
        "programmatic-nav": {
          title: "Navegar desde código",
          body: "Llama a navigate() desde un event handler o desde cualquier lugar fuera de un componente — tras un submit, un logout, un timeout. Sin hooks.",
        },
      },
      apps: [
        {
          name: "Reproductor de música",
          blurb:
            "Una UI de reproductor con vistas enrutadas — biblioteca, álbum, playlist.",
        },
        {
          name: "Tienda",
          blurb:
            "Un front-end de e-commerce — grid de productos, páginas de detalle, carrito.",
        },
      ],
    },
  },
} as const;

export function useExamplesT() {
  return examples[useLang()];
}
