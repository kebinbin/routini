import { useLang } from "./i18n";

// Docs-page copy. Imported only by the lazy Docs route, so it ships in the
// Docs chunk — not the initial bundle.
const docs = {
  en: {
    docs: {
      pretitle: "/docs",
      title: "API reference",
      sub: "Nine exports — the whole router. Each entry has a signature, a working example, and where it fits.",
      onThisPage: "On this page",
      groups: {
        components: "Components",
        hooks: "Hooks",
        utility: "Utility",
        guides: "Guides",
      },
      kind: {
        components: "component",
        hooks: "hook",
        utility: "function",
        guides: "guide",
      },
      since: "since",
      exampleLabel: "Example",
      tableHeading: {
        components: "Props",
        hooks: "Returns",
        utility: "Parameters",
        guides: "Props",
      },
      tableCols: { name: "Name", type: "Type", description: "Description" },
    },
    docsContent: {
      router: {
        body: "Router is the single entry point. It reads the current URL, matches it against your routes, and renders the matched page. It subscribes to history changes internally, so navigation from anywhere in the tree stays in sync — no provider juggling.",
        table: [
          {
            name: "routes",
            type: "RouteDefinition[]",
            desc: 'Route definitions, matched top to bottom. The first exact or pattern match wins; a "*" route is always tried last.',
          },
          {
            name: "loading",
            type: "ReactNode",
            desc: "Fallback shown while any lazy route's chunk loads. A route can override it with its own loading.",
          },
          {
            name: "children",
            type: "ReactNode",
            desc: "Optional. <Route> elements (merged into routes) and/or layout markup containing an <Outlet>.",
          },
          {
            name: "ssrPath",
            type: "string",
            desc: 'Initial path used when window is undefined (server rendering). Defaults to "/".',
          },
        ],
        notes: [
          "Define the routes array outside your component. A fresh array — and fresh lazy thunks — on every render misses the lazy cache and remounts the page.",
          "routes and children can be combined: <Route> children are appended to the routes array.",
          "In development, Router warns when no route matches and throws if a route sets both component and lazy.",
        ],
      },
      route: {
        body: "The JSX form of a route definition — an alternative to entries in the routes array, handy when you prefer declarative children. Route renders nothing itself; Router reads its props and renders the match into an <Outlet>.",
        table: [
          {
            name: "path",
            type: "string",
            desc: 'Exact ("/about"), param ("/user/:id"), or catch-all ("*").',
          },
          {
            name: "component",
            type: "ComponentType",
            desc: "Eager component, rendered directly. No code-splitting.",
          },
          {
            name: "lazy",
            type: "() => Promise<{ default }>",
            desc: "Dynamic import for a code-split route. routini wraps it in Suspense automatically.",
          },
          {
            name: "loading",
            type: "ReactNode",
            desc: "Per-route fallback while this lazy route loads. Overrides Router's loading.",
          },
        ],
        notes: [
          "Set component or lazy — never both. Doing so throws in development.",
          "Using <Route> children requires an <Outlet> inside Router to render the matched page.",
          "As with the routes array, hoist lazy thunks so their identity stays stable across renders.",
        ],
      },
      link: {
        body: "A drop-in replacement for <a> that navigates without a full page reload. It renders a real anchor element, so it's crawlable, keyboard-accessible, and respects every browser convention out of the box.",
        table: [
          {
            name: "to",
            type: "string",
            desc: "Destination path. May include a #hash.",
          },
          {
            name: "replace",
            type: "boolean",
            desc: "Replace the current history entry instead of pushing a new one.",
          },
          {
            name: "viewTransition",
            type: "boolean",
            desc: "Animate this navigation with the View Transitions API. Browsers without support navigate instantly.",
          },
          {
            name: "preload",
            type: '"hover" | "render"',
            desc: "Warm this route's lazy chunk ahead of the click — on hover/focus, or when the link mounts. No-op for eager routes. See Preloading.",
          },
          {
            name: "...rest",
            type: "AnchorHTMLAttributes",
            desc: "Any standard <a> attribute (className, style, aria-*, target, …) is forwarded to the anchor.",
          },
        ],
        notes: [
          "Falls back to the browser's default behavior on modifier keys (cmd/ctrl/shift/alt), non-primary clicks, and any target other than _self.",
          'Pure hash links (to="#section") scroll natively; path + hash (to="/docs#section") navigates, then scrolls to the element once the route has rendered.',
          "Because it renders a real <a href>, the link still works during a full-page load and is visible to crawlers.",
        ],
      },
      outlet: {
        body: "Renders the matched route inside your own layout. Use it when you pass markup as Router children: put <Outlet> where the page should appear, with shared chrome — nav, footer — around it.",
        notes: [
          "Takes no props.",
          "Only needed when Router has children. With just a routes array, Router renders the matched page directly and you can omit Outlet.",
          "Place a single Outlet inside the layout; it reads the matched page from context.",
        ],
      },
      "navigate-component": {
        body: 'A declarative redirect. When it mounts it navigates to to. Render it from a route to send visitors elsewhere — redirecting "/" to a default language, or guarding a page behind auth.',
        table: [
          {
            name: "to",
            type: "string",
            desc: "Destination path to redirect to when the component mounts.",
          },
          {
            name: "replace",
            type: "boolean",
            desc: "Defaults to true: the redirect replaces the current history entry. Pass false to push a new one.",
          },
        ],
        notes: [
          "The redirect runs in an effect after mount, and re-fires if to changes.",
          "Replacing keeps the back button working — a pushed redirect would send Back to the route that redirected away, which immediately redirects forward again.",
          "Renders null — it produces no markup of its own.",
          "For redirects triggered by an event or some logic, call the navigate utility instead.",
        ],
      },
      "use-location": {
        body: "Returns the current location and the navigate function. The component re-renders whenever the URL changes, so the path you read here always reflects the live route.",
        table: [
          {
            name: "path",
            type: "string",
            desc: "The current pathname — no query string, no hash.",
          },
          {
            name: "navigate",
            type: "(to: string) => void",
            desc: "Imperative navigation, identical to the exported utility.",
          },
        ],
        notes: [
          "path is the pathname only. Use URLSearchParams for the query string and window.location.hash for the fragment.",
        ],
      },
      "use-params": {
        body: "Returns the dynamic segments of the matched route as an object. Pass a type argument to describe its shape; values are always strings and are URL-decoded for you.",
        table: [
          {
            name: "T",
            type: "Record<string, string>",
            desc: "Optional type argument describing the param shape. Defaults to Record<string, string>.",
          },
        ],
        notes: [
          'For route "/user/:id" at "/user/42", returns { id: "42" }. Encoded values like %20 are decoded to spaces.',
          "The type argument is a compile-time cast, not runtime validation — it won't throw if a param is missing.",
          "Returns an empty object on routes that declare no params.",
        ],
      },
      "use-search-params": {
        body: "Reads and updates the URL's query string reactively, returning a [params, setSearchParams] tuple — the same shape as useState. Reading re-renders the component whenever the query changes (typing, a link, Back/Forward), so search state lives in the URL: shareable, bookmarkable, and survivable across a refresh.",
        table: [
          {
            name: "[0] params",
            type: "URLSearchParams",
            desc: 'The current query. Read values with params.get("q").',
          },
          {
            name: "[1] setSearchParams",
            type: "(init, options?) => void",
            desc: "Navigate to the current pathname with a new query. init is a string, a Record<string, string>, or a URLSearchParams; options takes the usual { replace, viewTransition }.",
          },
        ],
        notes: [
          "Pushes a new history entry by default — pass { replace: true } for high-frequency updates like a sort toggle, so you don't flood the back button.",
          "The setter keeps the current pathname and drops any #hash.",
          "Why it's its own hook: routini's location store tracks the pathname only, so a query-only navigation never remounts the route. useSearchParams subscribes to the query separately — reading it stays reactive while your page keeps its state, scroll, and input focus.",
        ],
      },
      "navigate-util": {
        body: "Imperative navigation for use outside React components or inside event handlers. It updates the URL via the History API and notifies Router to re-render — the same function powering Link and Navigate.",
        table: [
          {
            name: "to",
            type: "string",
            desc: "Destination path. May include a #hash.",
          },
          {
            name: "options",
            type: "NavigateOptions",
            desc: "Optional. { replace?: boolean, viewTransition?: boolean } — swap the history entry instead of pushing, and/or animate the navigation.",
          },
        ],
        notes: [
          "Adds a new history entry by default, so the back button returns to the previous route; { replace: true } swaps the current entry instead.",
          "No-ops during server rendering (when window is undefined).",
          "Inside a component you can also read it from useLocation().",
        ],
      },
      "error-handling": {
        body: "Lazy routes can fail to load — most often a stale chunk after a deploy, or a network blip. Suspense doesn't catch this, so a failed import would otherwise unmount the whole app. Router wraps every route in an error boundary that catches failed lazy chunks and render errors alike, and clears itself when you navigate away. Pass errorFallback to replace the default UI and onError to log.",
        table: [
          {
            name: "errorFallback",
            type: "ReactNode | (ctx) => ReactNode",
            desc: "What to render when a route fails. The function form receives { error, reset, reload, isChunkError }. Defaults to a minimal message.",
          },
          {
            name: "onError",
            type: "(error, info) => void",
            desc: "Called whenever a route errors — wire it to your logging or telemetry.",
          },
        ],
        notes: [
          "reset() retries the route in place (re-runs a failed lazy import, keeps app state). reload() hard-reloads the page — routini never calls it itself. isChunkError tells a failed code-split download from a render bug.",
          "The boundary catches both failed lazy chunks and render errors in the page, and clears the error automatically when you navigate to another route.",
          "It wraps the matched page, so any layout components around <Outlet /> stay on screen when a page errors. It does not cover those layout components themselves — wrap <Router> in your own boundary if anything in your layout can throw.",
          "routini surfaces the error and lets you decide — it never auto-reloads or writes to storage.",
        ],
      },
      "view-transitions": {
        body: "Opt any navigation into the View Transitions API: the browser snapshots the old and new page and animates between them. Pass viewTransition on a Link, or { viewTransition: true } to navigate. The animation itself is designed in CSS — the default is a quick cross-fade; give an element a view-transition-name to morph it between pages, like an album cover growing into the detail header.",
        table: [
          {
            name: "viewTransition",
            type: "boolean",
            desc: "On <Link> — animate this navigation.",
          },
          {
            name: "{ viewTransition: true }",
            type: "NavigateOptions",
            desc: "On navigate() — same, from code.",
          },
        ],
        notes: [
          "Progressive enhancement: browsers without document.startViewTransition navigate instantly — no feature checks needed in your code.",
          "Opt in per navigation: the page is non-interactive while an animation runs, so reserve it for navigations where motion adds meaning.",
          "On a lazy route whose chunk isn't loaded yet, the transition animates to the loading fallback rather than the page — add preload to the Link so the chunk is warm first (see Preloading).",
          "Customize with the ::view-transition-old/new pseudo-elements; scope per-element morphs with view-transition-name.",
        ],
      },
      preloading: {
        body: 'Load a lazy route\'s code-split chunk before the user navigates, so the page is ready on click — no loading fallback, and View Transitions land on the real page instead of a spinner. Add preload to a Link: "hover" warms the chunk on pointer-enter or keyboard focus; "render" warms it as soon as the link mounts, in an idle callback that never competes with the current page\'s own loading; "viewport" warms it when the link scrolls into view.',
        table: [
          {
            name: 'preload="hover"',
            type: "on <Link>",
            desc: "Warm the chunk on hover or keyboard focus — the user has signalled intent. The right default for most links.",
          },
          {
            name: 'preload="render"',
            type: "on <Link>",
            desc: "Warm the chunk when the link mounts, scheduled in an idle callback. Best for the one route almost everyone visits next.",
          },
          {
            name: 'preload="viewport"',
            type: "on <Link>",
            desc: "Warm the chunk when the link scrolls into view, via IntersectionObserver. Best for links far down a long page.",
          },
        ],
        notes: [
          "Only lazy routes have a chunk to fetch — preload is a no-op for eager routes.",
          "Each chunk is fetched at most once, however many times it's hovered or however many links point at it.",
          "All viewport links share a single IntersectionObserver, so a long list of links stays cheap; each warms once. A no-op where IntersectionObserver is unavailable.",
          "A failed preload is swallowed silently; the real navigation still surfaces the error through the route error boundary.",
          "Pairs with View Transitions: warm the chunk so the animation lands on the real page rather than the loading fallback.",
        ],
      },
      "scroll-restoration": {
        body: "Opt in to the scroll behavior most SPAs want: a forward navigation starts at the top, and returning via back/forward puts you back where you left off. Only the router knows which kind of navigation just happened, which is why this lives here rather than in a scroll hook you'd have to call on every page.",
        table: [
          {
            name: "scrollRestoration",
            type: "boolean",
            desc: "On <Router>. Off by default; turn it on to enable the behavior above.",
          },
          {
            name: "scrollContainer",
            type: "RefObject<Element | null>",
            desc: "Optional. Scroll a specific element instead of the window — for layouts where the page scrolls inside a nested container.",
          },
        ],
        notes: [
          "Keyed on the pathname, so a query-only navigation (useSearchParams) never resets scroll.",
          "Each history entry gets its own cached offset, restored when you return to it — not just \"remember the last scroll position.\"",
        ],
      },
      "reading-version": {
        body: 'The installed version is available straight from the package, so a footer or an about page never drifts out of sync with a hand-copied string.',
        notes: [
          'Reads from routini\'s own package.json via the exports map — no separate version constant to maintain.',
        ],
      },
    },
  },
  es: {
    docs: {
      pretitle: "/docs",
      title: "Referencia del API",
      sub: "Nueve exports — todo el router. Cada entrada tiene una firma, un ejemplo funcional y dónde encaja.",
      onThisPage: "En esta página",
      groups: {
        components: "Componentes",
        hooks: "Hooks",
        utility: "Utilidad",
        guides: "Guías",
      },
      kind: {
        components: "componente",
        hooks: "hook",
        utility: "función",
        guides: "guía",
      },
      since: "desde",
      exampleLabel: "Ejemplo",
      tableHeading: {
        components: "Props",
        hooks: "Devuelve",
        utility: "Parámetros",
        guides: "Props",
      },
      tableCols: { name: "Nombre", type: "Tipo", description: "Descripción" },
    },
    docsContent: {
      router: {
        body: "Router es el único punto de entrada. Lee la URL actual, la empareja con tus rutas y renderiza la página correspondiente. Se suscribe a los cambios del historial internamente, así que la navegación desde cualquier parte del árbol se mantiene sincronizada — sin malabares de providers.",
        table: [
          {
            name: "routes",
            type: "RouteDefinition[]",
            desc: 'Definiciones de rutas, evaluadas de arriba a abajo. Gana la primera coincidencia exacta o por patrón; una ruta "*" siempre se prueba al final.',
          },
          {
            name: "loading",
            type: "ReactNode",
            desc: "Fallback mostrado mientras carga el chunk de una ruta lazy. Una ruta puede sobrescribirlo con su propio loading.",
          },
          {
            name: "children",
            type: "ReactNode",
            desc: "Opcional. Elementos <Route> (combinados con routes) y/o el layout con un <Outlet>.",
          },
          {
            name: "ssrPath",
            type: "string",
            desc: 'Ruta inicial usada cuando window no existe (renderizado en servidor). Por defecto "/".',
          },
        ],
        notes: [
          "Define el array de rutas fuera de tu componente. Un array nuevo — y thunks lazy nuevos — en cada render pierde la caché lazy y vuelve a montar la página.",
          "routes y children se pueden combinar: los hijos <Route> se añaden al array de rutas.",
          "En desarrollo, Router avisa cuando ninguna ruta coincide y lanza un error si una ruta define component y lazy a la vez.",
        ],
      },
      route: {
        body: "La forma JSX de una definición de ruta — una alternativa a las entradas del array de rutas, útil si prefieres hijos declarativos. Route no renderiza nada por sí mismo; Router lee sus props y renderiza la coincidencia en un <Outlet>.",
        table: [
          {
            name: "path",
            type: "string",
            desc: 'Exacta ("/about"), con parámetro ("/user/:id") o comodín ("*").',
          },
          {
            name: "component",
            type: "ComponentType",
            desc: "Componente eager, renderizado directamente. Sin code-splitting.",
          },
          {
            name: "lazy",
            type: "() => Promise<{ default }>",
            desc: "Import dinámico para una ruta con code-splitting. routini la envuelve en Suspense automáticamente.",
          },
          {
            name: "loading",
            type: "ReactNode",
            desc: "Fallback por ruta mientras carga esta ruta lazy. Sobrescribe el loading de Router.",
          },
        ],
        notes: [
          "Define component o lazy — nunca ambos. Hacerlo lanza un error en desarrollo.",
          "Usar hijos <Route> requiere un <Outlet> dentro de Router para renderizar la página coincidente.",
          "Igual que con el array de rutas, eleva (hoist) los thunks lazy para que su identidad sea estable entre renders.",
        ],
      },
      link: {
        body: "Un reemplazo directo de <a> que navega sin recargar la página completa. Renderiza un elemento ancla real, así que es rastreable, accesible por teclado y respeta todas las convenciones del navegador.",
        table: [
          {
            name: "to",
            type: "string",
            desc: "Ruta de destino. Puede incluir un #hash.",
          },
          {
            name: "replace",
            type: "boolean",
            desc: "Reemplaza la entrada actual del historial en lugar de añadir una nueva.",
          },
          {
            name: "viewTransition",
            type: "boolean",
            desc: "Anima esta navegación con la View Transitions API. Los navegadores sin soporte navegan al instante.",
          },
          {
            name: "preload",
            type: '"hover" | "render"',
            desc: "Precarga el chunk lazy de esta ruta antes del clic — al pasar el cursor/foco, o al montar el enlace. No hace nada en rutas eager. Ver Precarga.",
          },
          {
            name: "...rest",
            type: "AnchorHTMLAttributes",
            desc: "Cualquier atributo estándar de <a> (className, style, aria-*, target, …) se reenvía al ancla.",
          },
        ],
        notes: [
          "Recurre al comportamiento por defecto del navegador con teclas modificadoras (cmd/ctrl/shift/alt), clics no primarios y cualquier target distinto de _self.",
          'Los enlaces de hash puro (to="#section") hacen scroll de forma nativa; ruta + hash (to="/docs#section") navega y luego hace scroll al elemento una vez renderizada la ruta.',
          "Como renderiza un <a href> real, el enlace sigue funcionando durante una carga completa y es visible para los rastreadores.",
        ],
      },
      outlet: {
        body: "Renderiza la ruta coincidente dentro de tu propio layout. Úsalo cuando pasas markup como hijos de Router: coloca <Outlet> donde debe aparecer la página, con el chrome compartido — nav, footer — alrededor.",
        notes: [
          "No recibe props.",
          "Solo se necesita cuando Router tiene children. Con solo un array de rutas, Router renderiza la página directamente y puedes omitir Outlet.",
          "Coloca un único Outlet dentro del layout; lee la página coincidente desde el contexto.",
        ],
      },
      "navigate-component": {
        body: 'Una redirección declarativa. Al montarse, navega a to. Renderízalo desde una ruta para enviar a los visitantes a otro sitio — redirigir "/" a un idioma por defecto o proteger una página tras autenticación.',
        table: [
          {
            name: "to",
            type: "string",
            desc: "Ruta de destino a la que redirigir cuando el componente se monta.",
          },
          {
            name: "replace",
            type: "boolean",
            desc: "Por defecto true: la redirección reemplaza la entrada actual del historial. Pasa false para añadir una nueva.",
          },
        ],
        notes: [
          "La redirección se ejecuta en un efecto tras el montaje, y se vuelve a disparar si to cambia.",
          "Reemplazar mantiene el botón atrás funcionando — una redirección con push enviaría Atrás a la ruta que redirigió, que inmediatamente redirige hacia adelante otra vez.",
          "Renderiza null — no produce markup propio.",
          "Para redirecciones disparadas por un evento o cierta lógica, llama a la utilidad navigate.",
        ],
      },
      "use-location": {
        body: "Devuelve la ubicación actual y la función navigate. El componente se vuelve a renderizar cuando cambia la URL, así que el path que lees aquí siempre refleja la ruta en vivo.",
        table: [
          {
            name: "path",
            type: "string",
            desc: "El pathname actual — sin query string ni hash.",
          },
          {
            name: "navigate",
            type: "(to: string) => void",
            desc: "Navegación imperativa, idéntica a la utilidad exportada.",
          },
        ],
        notes: [
          "path es solo el pathname. Usa URLSearchParams para el query string y window.location.hash para el fragmento.",
        ],
      },
      "use-params": {
        body: "Devuelve los segmentos dinámicos de la ruta coincidente como un objeto. Pasa un argumento de tipo para describir su forma; los valores siempre son strings y se decodifican (URL-decode) por ti.",
        table: [
          {
            name: "T",
            type: "Record<string, string>",
            desc: "Argumento de tipo opcional que describe la forma de los params. Por defecto Record<string, string>.",
          },
        ],
        notes: [
          'Para la ruta "/user/:id" en "/user/42", devuelve { id: "42" }. Valores codificados como %20 se decodifican a espacios.',
          "El argumento de tipo es un cast en tiempo de compilación, no validación en runtime — no lanzará error si falta un param.",
          "Devuelve un objeto vacío en rutas que no declaran params.",
        ],
      },
      "use-search-params": {
        body: "Lee y actualiza el query string de la URL de forma reactiva, devolviendo una tupla [params, setSearchParams] — la misma forma que useState. Leer re-renderiza el componente cada vez que el query cambia (al escribir, un enlace, atrás/adelante), así que el estado de búsqueda vive en la URL: compartible, guardable y que sobrevive a un refresco.",
        table: [
          {
            name: "[0] params",
            type: "URLSearchParams",
            desc: 'El query actual. Lee valores con params.get("q").',
          },
          {
            name: "[1] setSearchParams",
            type: "(init, options?) => void",
            desc: "Navega al pathname actual con un nuevo query. init es un string, un Record<string, string> o un URLSearchParams; options acepta el habitual { replace, viewTransition }.",
          },
        ],
        notes: [
          "Añade una nueva entrada al historial por defecto — pasa { replace: true } para cambios frecuentes como un selector de orden, para no inundar el botón atrás.",
          "El setter mantiene el pathname actual y descarta cualquier #hash.",
          "Por qué es su propio hook: el store de ubicación de routini solo sigue el pathname, así que una navegación de solo-query nunca remonta la ruta. useSearchParams se suscribe al query por separado — leerlo sigue siendo reactivo mientras tu página conserva su estado, scroll y foco del input.",
        ],
      },
      "navigate-util": {
        body: "Navegación imperativa para usar fuera de componentes de React o dentro de event handlers. Actualiza la URL con la History API y notifica a Router para re-renderizar — la misma función que usan Link y Navigate.",
        table: [
          {
            name: "to",
            type: "string",
            desc: "Ruta de destino. Puede incluir un #hash.",
          },
          {
            name: "options",
            type: "NavigateOptions",
            desc: "Opcional. { replace?: boolean, viewTransition?: boolean } — reemplaza la entrada del historial en lugar de añadir, y/o anima la navegación.",
          },
        ],
        notes: [
          "Añade una nueva entrada al historial por defecto, así que el botón atrás vuelve a la ruta anterior; { replace: true } reemplaza la entrada actual.",
          "No hace nada durante el renderizado en servidor (cuando window no existe).",
          "Dentro de un componente también puedes obtenerla desde useLocation().",
        ],
      },
      "error-handling": {
        body: "Las rutas lazy pueden fallar al cargar — casi siempre un chunk obsoleto tras un deploy, o un corte de red. Suspense no captura esto, así que un import fallido desmontaría toda la app. Router envuelve cada ruta en un error boundary que captura tanto chunks lazy fallidos como errores de render, y se limpia solo al navegar a otra ruta. Pasa errorFallback para reemplazar la UI por defecto y onError para registrar.",
        table: [
          {
            name: "errorFallback",
            type: "ReactNode | (ctx) => ReactNode",
            desc: "Qué renderizar cuando una ruta falla. La forma de función recibe { error, reset, reload, isChunkError }. Por defecto, un mensaje mínimo.",
          },
          {
            name: "onError",
            type: "(error, info) => void",
            desc: "Se llama cuando una ruta lanza un error — conéctalo a tu logging o telemetría.",
          },
        ],
        notes: [
          "reset() reintenta la ruta en el sitio (vuelve a ejecutar un import lazy fallido, conserva el estado de la app). reload() recarga la página por completo — routini nunca lo llama por ti. isChunkError distingue una descarga de chunk fallida de un error de render.",
          "El boundary captura tanto chunks lazy fallidos como errores de render en la página, y limpia el error automáticamente al navegar a otra ruta.",
          "Envuelve la página coincidente, así que cualquier componente de tu layout alrededor de <Outlet /> sigue en pantalla cuando una página falla. No cubre esos componentes del layout — envuelve <Router> en tu propio boundary si algo de tu layout puede lanzar errores.",
          "routini expone el error y te deja decidir — nunca recarga solo ni escribe en storage.",
        ],
      },
      "view-transitions": {
        body: "Activa la View Transitions API en cualquier navegación: el navegador captura la página vieja y la nueva y anima entre ambas. Pasa viewTransition en un Link, o { viewTransition: true } a navigate. La animación se diseña en CSS — por defecto es un cross-fade rápido; dale a un elemento un view-transition-name para transformarlo entre páginas, como una portada de álbum que crece hasta ser la cabecera del detalle.",
        table: [
          {
            name: "viewTransition",
            type: "boolean",
            desc: "En <Link> — anima esta navegación.",
          },
          {
            name: "{ viewTransition: true }",
            type: "NavigateOptions",
            desc: "En navigate() — lo mismo, desde código.",
          },
        ],
        notes: [
          "Mejora progresiva: los navegadores sin document.startViewTransition navegan al instante — sin checks de soporte en tu código.",
          "Actívala por navegación: la página no es interactiva mientras corre la animación, así que resérvala para navegaciones donde el movimiento aporte significado.",
          "En una ruta lazy cuyo chunk no está cargado, la transición anima hacia el fallback de carga en lugar de la página — añade preload al Link para que el chunk esté caliente primero (ver Precarga).",
          "Personalízala con los pseudo-elementos ::view-transition-old/new; delimita transformaciones por elemento con view-transition-name.",
        ],
      },
      preloading: {
        body: 'Carga el chunk de una ruta lazy antes de que el usuario navegue, para que la página esté lista al hacer clic — sin fallback de carga, y las View Transitions aterrizan en la página real en lugar de un spinner. Añade preload a un Link: "hover" precarga el chunk al pasar el cursor o dar foco con el teclado; "render" lo precarga en cuanto el enlace se monta, en un callback de inactividad que nunca compite con la carga de la página actual; "viewport" lo precarga cuando el enlace entra en pantalla.',
        table: [
          {
            name: 'preload="hover"',
            type: "en <Link>",
            desc: "Precarga el chunk al pasar el cursor o dar foco — el usuario mostró intención. El valor por defecto adecuado para la mayoría de enlaces.",
          },
          {
            name: 'preload="render"',
            type: "en <Link>",
            desc: "Precarga el chunk cuando el enlace se monta, programado en un callback de inactividad. Ideal para la ruta que casi todos visitan después.",
          },
          {
            name: 'preload="viewport"',
            type: "en <Link>",
            desc: "Precarga el chunk cuando el enlace entra en pantalla, vía IntersectionObserver. Ideal para enlaces muy abajo en una página larga.",
          },
        ],
        notes: [
          "Solo las rutas lazy tienen un chunk que cargar — preload no hace nada en rutas eager.",
          "Cada chunk se carga como mucho una vez, sin importar cuántas veces se pase el cursor ni cuántos enlaces apunten a él.",
          "Todos los enlaces viewport comparten un único IntersectionObserver, así que una lista larga de enlaces sigue siendo barata; cada uno precarga una vez. No hace nada donde IntersectionObserver no está disponible.",
          "Una precarga fallida se ignora en silencio; la navegación real sigue mostrando el error a través del error boundary de ruta.",
          "Combina con View Transitions: precarga el chunk para que la animación aterrice en la página real en lugar del fallback de carga.",
        ],
      },
      "scroll-restoration": {
        body: "Activa el comportamiento de scroll que la mayoría de SPAs quieren: una navegación hacia adelante empieza arriba del todo, y volver con atrás/adelante te devuelve a donde estabas. Solo el router sabe qué tipo de navegación acaba de ocurrir, por eso vive aquí y no en un hook de scroll que tendrías que llamar en cada página.",
        table: [
          {
            name: "scrollRestoration",
            type: "boolean",
            desc: "En <Router>. Desactivado por defecto; actívalo para habilitar el comportamiento anterior.",
          },
          {
            name: "scrollContainer",
            type: "RefObject<Element | null>",
            desc: "Opcional. Hace scroll en un elemento concreto en vez de la ventana — para layouts donde la página se desplaza dentro de un contenedor anidado.",
          },
        ],
        notes: [
          "Se indexa por el pathname, así que una navegación de solo-query (useSearchParams) nunca resetea el scroll.",
          "Cada entrada del historial guarda su propio offset, restaurado al volver a ella — no solo \"recordar la última posición\".",
        ],
      },
      "reading-version": {
        body: "La versión instalada está disponible directamente desde el paquete, así que un footer o una página about nunca se desincroniza de una cadena copiada a mano.",
        notes: [
          "Se lee desde el propio package.json de routini vía el exports map — sin una constante de versión separada que mantener.",
        ],
      },
    },
  },
} as const;

export function useDocsT() {
  return docs[useLang()];
}
