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
        preload: {
          title: "Preload on hover, render, or viewport",
          body: 'Warm a lazy route\'s chunk before the click so the page is ready instantly. preload="hover" fetches on pointer-enter or keyboard focus; preload="render" fetches when the link mounts, in an idle callback; preload="viewport" fetches when the link scrolls into view (all viewport links share one IntersectionObserver). It\'s a no-op for eager routes, and each chunk is fetched at most once.',
        },
        "view-transitions": {
          title: "Animate with View Transitions",
          body: "Pass viewTransition on a Link (or { viewTransition: true } to navigate) and the browser animates between the old and new page. Give an element a view-transition-name to morph it across pages. Unsupported browsers navigate instantly — pair it with preload so lazy routes animate to the real page, not the loading fallback.",
        },
        "shared-element": {
          title: "Morph an element across pages",
          body: "Give the same element on both pages a matching viewTransitionName and the browser morphs one into the other on navigation — no extra wiring. Names must be unique per item, so key them by id; add a shared viewTransitionClass and you can style the whole family with ::view-transition-group(.cover) instead of per-id rules. routini only owns the trigger (viewTransition) — the naming and the motion stay yours, in CSS. When many items link to the same page, set the name on the clicked element in onPointerDown so only that one morphs.",
        },
        "error-handling": {
          title: "Recover from a failed chunk",
          body: "A stale chunk after a deploy — or a render error — would white-screen the app. routini wraps every route in an error boundary. Pass errorFallback for the UI and onError to log, or pass nothing for a minimal default: reset() retries in place, reload() does a full reload, and isChunkError tells the two apart.",
        },
        "typed-params": {
          title: "Typed params + your data layer",
          body: "Read URL params with useParams<T>() and hand the id to whatever you fetch with — SWR, React Query, fetch. routini gives you the route; your data layer does the rest.",
        },
        "search-params": {
          title: "Search & filters in the URL",
          body: "useSearchParams() makes the query string reactive: read it like state, write it to update the URL. Search and filters become shareable, bookmarkable, and Back/Forward-able — push as the user types, replace for high-frequency toggles like a sort. The route never remounts on a query change, so the input keeps focus and scroll holds.",
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
        preload: {
          title: "Precarga al pasar el cursor, al montar o en viewport",
          body: 'Precalienta el chunk de una ruta lazy antes del clic para que la página esté lista al instante. preload="hover" carga al pasar el cursor o dar foco con el teclado; preload="render" carga cuando el enlace se monta, en un callback de inactividad; preload="viewport" carga cuando el enlace entra en pantalla (todos los enlaces viewport comparten un único IntersectionObserver). No hace nada en rutas eager, y cada chunk se carga como mucho una vez.',
        },
        "view-transitions": {
          title: "Anima con View Transitions",
          body: "Pasa viewTransition en un Link (o { viewTransition: true } a navigate) y el navegador anima entre la página vieja y la nueva. Dale a un elemento un view-transition-name para transformarlo entre páginas. Los navegadores sin soporte navegan al instante — combínalo con preload para que las rutas lazy aterricen en la página real, no en el fallback de carga.",
        },
        "shared-element": {
          title: "Transforma un elemento entre páginas",
          body: "Dale al mismo elemento en ambas páginas un viewTransitionName coincidente y el navegador transforma uno en otro al navegar — sin nada más. Los nombres deben ser únicos por elemento, así que indéxalos por id; añade un viewTransitionClass compartido y podrás dar estilo a toda la familia con ::view-transition-group(.cover) en vez de reglas por id. routini solo gestiona el disparador (viewTransition) — el nombrado y el movimiento son tuyos, en CSS. Cuando muchos elementos enlazan a la misma página, asigna el nombre al elemento pulsado en onPointerDown para que solo ese haga el morph.",
        },
        "error-handling": {
          title: "Recuperarse de un chunk fallido",
          body: "Un chunk obsoleto tras un deploy — o un error de render — dejaría la app en blanco. routini envuelve cada ruta en un error boundary. Pasa errorFallback para la UI y onError para registrar, o no pases nada para un mínimo por defecto: reset() reintenta en el sitio, reload() recarga del todo e isChunkError distingue ambos casos.",
        },
        "typed-params": {
          title: "Params tipados + tu capa de datos",
          body: "Lee los params de la URL con useParams<T>() y pasa el id a lo que uses para fetch — SWR, React Query, fetch. routini te da la ruta; tu capa de datos hace el resto.",
        },
        "search-params": {
          title: "Búsqueda y filtros en la URL",
          body: "useSearchParams() hace reactivo el query string: léelo como estado, escríbelo para actualizar la URL. La búsqueda y los filtros pasan a ser compartibles, guardables y navegables con atrás/adelante — usa push mientras el usuario escribe, replace para cambios frecuentes como un orden. La ruta no se remonta al cambiar el query, así que el input mantiene el foco y el scroll se queda donde está.",
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
