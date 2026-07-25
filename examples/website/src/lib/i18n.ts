import { useParams } from "routini";

export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

export function isLang(value: unknown): value is Lang {
  return (
    typeof value === "string" && (LANGS as readonly string[]).includes(value)
  );
}

/**
 * Global UI strings — present on every page (nav, footer), so they ship in the
 * initial bundle. Page-specific copy lives in per-page modules (i18n.home.ts,
 * i18n.docs.ts, …) and loads with the page that uses it, keeping lazy routes'
 * text out of the initial download.
 */
const global = {
  en: {
    nav: { docs: "docs", examples: "examples", github: "GitHub" },
    footer: { builtWith: "built with", builtBy: "built by" },
    install: { copy: "Copy install command", copied: "Copied" },
    skipToContent: "Skip to content",
  },
  es: {
    nav: { docs: "docs", examples: "ejemplos", github: "GitHub" },
    footer: { builtWith: "hecho con", builtBy: "hecho por" },
    install: { copy: "Copiar comando de instalación", copied: "Copiado" },
    skipToContent: "Saltar al contenido",
  },
} as const;

export function useLang(): Lang {
  const { lang } = useParams<{ lang?: string }>();
  return isLang(lang) ? lang : DEFAULT_LANG;
}

/** Global strings (nav, footer). For page copy, use the per-page hooks. */
export function useT() {
  return global[useLang()];
}

/** Build a route path with the current language prefix, e.g. langPath("en", "/docs") → "/en/docs" */
export function langPath(lang: Lang, path: string = ""): string {
  if (!path || path === "/") return `/${lang}`;
  return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
}
