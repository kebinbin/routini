import { useLang } from "./i18n";

// 404-page copy. Imported only by the lazy catch-all route.
const notFound = {
  en: {
    notFound: {
      pretitle: "404",
      title: "No route matched.",
      sub: "The URL didn't match any of the routes defined in this site.",
      home: "Back home",
    },
  },
  es: {
    notFound: {
      pretitle: "404",
      title: "Ninguna ruta coincide.",
      sub: "La URL no coincide con ninguna ruta definida en este sitio.",
      home: "Volver al inicio",
    },
  },
} as const;

export function useNotFoundT() {
  return notFound[useLang()];
}
