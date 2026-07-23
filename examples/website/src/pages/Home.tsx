import { Link } from "routini";
import { ArrowRight } from "lucide-react";
import { InstallCommand } from "../components/InstallCommand";
import { Logo } from "../components/Logo";
import { GithubMark } from "../components/GithubMark";
import { Highlights } from "../components/Highlights";
import { Bundle } from "../components/Bundle";
import { BuiltInV1 } from "../components/BuiltInVariants";
import { BuiltWith } from "../components/BuiltWith";
import { langPath, useLang } from "../lib/i18n";
import { useHomeT } from "../lib/i18n.home";
import { usePageTitle } from "../lib/usePageTitle";

export default function Home() {
  const lang = useLang();
  const t = useHomeT();
  usePageTitle("routini · a tiny React router");

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-20 md:py-28">
        <div className="flex flex-col items-center text-center">
          <Logo animated className="mb-10 h-12 w-auto text-bone-dim md:h-22" />

          <p className="mb-6 text-base font-medium text-bone-dim sm:text-lg">
            {t.home.pretitle}
          </p>

          <h1 className="text-balance text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:text-[5rem]">
            <span className="block">{t.home.title1}</span>
            <span className="block">{t.home.title2}</span>
          </h1>

          <p className="text-balance mt-8 max-w-xl text-sm leading-relaxed text-bone-dim sm:text-base">
            {t.home.sub}
          </p>

          <div className="mt-10 flex flex-col items-end gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to={langPath(lang, "/docs")}
                viewTransition
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {t.home.ctaDocs}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <InstallCommand />
            </div>

            <a
              href="https://github.com/kebinbin/routini"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs text-bone-faint opacity-60 underline-offset-4 transition hover:text-bone hover:opacity-100 hover:underline"
            >
              <GithubMark className="h-3 w-3" />
              {t.home.ctaGithub}
            </a>
          </div>
        </div>
      </section>

      <Highlights />
      <Bundle />

      {/* Bento redesign (work in progress). Once settled, fold BuiltInV1 back
          into BuiltIn.tsx and delete BuiltInVariants.tsx. */}
      <BuiltInV1 />

      <BuiltWith />
    </>
  );
}
