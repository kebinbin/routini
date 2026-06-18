import { Link } from "routini";
import { ArrowRight } from "lucide-react";
import { InstallCommand } from "../components/InstallCommand";
import { Logo } from "../components/Logo";
import { WhyRoutini } from "../components/WhyRoutini";
import { BuiltIn } from "../components/BuiltIn";
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

          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
            {t.home.pretitle}
          </p>

          <h1 className="text-balance text-5xl font-medium leading-none tracking-tight md:text-7xl">
            {t.home.title1}
            <br />
            <span className="text-bone-dim">{t.home.title2}</span>
          </h1>

          <p className="text-balance mt-8 max-w-xl text-lg text-bone-dim md:text-xl">
            {t.home.sub}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={langPath(lang, "/docs")}
              viewTransition
              className="group inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-sm text-white transition-colors hover:bg-accent-dim"
            >
              {t.home.ctaDocs}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <InstallCommand />
          </div>
        </div>
      </section>

      <WhyRoutini />
      <BuiltIn />
      <BuiltWith />
    </>
  );
}
