import { useLang } from "./i18n";

// Examples-page copy. Imported only by the lazy Examples route.
const examples = {
  en: {
    examples: {
      pretitle: "/examples",
      title: "Annotated examples",
      sub: "Coming next: runnable patterns with explained code samples.",
    },
  },
  es: {
    examples: {
      pretitle: "/ejemplos",
      title: "Ejemplos comentados",
      sub: "Próximamente: patrones ejecutables con código explicado.",
    },
  },
} as const;

export function useExamplesT() {
  return examples[useLang()];
}
