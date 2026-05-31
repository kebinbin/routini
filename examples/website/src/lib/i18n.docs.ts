import { useLang } from "./i18n";

// Docs-page copy. Imported only by the lazy Docs route, so it ships in the
// Docs chunk — not the initial bundle.
const docs = {
  en: {
    docs: {
      pretitle: "/docs",
      title: "API reference",
      sub: "Seven exports and one utility — the whole router. Each entry has a signature, a working example, and where it fits.",
      onThisPage: "On this page",
      groups: { components: "Components", hooks: "Hooks", utility: "Utility" },
      kind: { components: "component", hooks: "hook", utility: "function" },
      since: "since",
      exampleLabel: "Example",
      tableHeading: {
        components: "Props",
        hooks: "Returns",
        utility: "Parameters",
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
        ],
        notes: [
          "The redirect runs in an effect after mount, and re-fires if to changes.",
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
      "navigate-util": {
        body: "Imperative navigation for use outside React components or inside event handlers. It updates the URL with History pushState and notifies Router to re-render — the same function powering Link and Navigate.",
        table: [
          {
            name: "to",
            type: "string",
            desc: "Destination path. May include a #hash.",
          },
        ],
        notes: [
          "Adds a new history entry, so the back button returns to the previous route.",
          "No-ops during server rendering (when window is undefined).",
          "Inside a component you can also read it from useLocation().",
        ],
      },
    },
  },
  es: {
    docs: {
      pretitle: "/docs",
      title: "Referencia del API",
      sub: "Siete exports y una utilidad — todo el router. Cada entrada tiene una firma, un ejemplo funcional y dónde encaja.",
      onThisPage: "En esta página",
      groups: {
        components: "Componentes",
        hooks: "Hooks",
        utility: "Utilidad",
      },
      kind: { components: "componente", hooks: "hook", utility: "función" },
      since: "desde",
      exampleLabel: "Ejemplo",
      tableHeading: {
        components: "Props",
        hooks: "Devuelve",
        utility: "Parámetros",
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
        ],
        notes: [
          "La redirección se ejecuta en un efecto tras el montaje, y se vuelve a disparar si to cambia.",
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
      "navigate-util": {
        body: "Navegación imperativa para usar fuera de componentes de React o dentro de event handlers. Actualiza la URL con History pushState y notifica a Router para re-renderizar — la misma función que usan Link y Navigate.",
        table: [
          {
            name: "to",
            type: "string",
            desc: "Ruta de destino. Puede incluir un #hash.",
          },
        ],
        notes: [
          "Añade una nueva entrada al historial, así que el botón atrás vuelve a la ruta anterior.",
          "No hace nada durante el renderizado en servidor (cuando window no existe).",
          "Dentro de un componente también puedes obtenerla desde useLocation().",
        ],
      },
    },
  },
} as const;

export function useDocsT() {
  return docs[useLang()];
}
