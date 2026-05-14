import { useEffect } from "react";
import { Link } from "../routini/components/Link";
import { useParams } from "../routini/hooks/useParams";

console.log("About page imported");

const i18n = {
  en: {
    about: "About",
    goToHome: "Go to home",
  },
  es: {
    about: "Acerca de",
    goToHome: "Ir a inicio",
  },
};

const useI18n = (lang: string) => {
  return lang in i18n ? i18n[lang as keyof typeof i18n] : i18n.en;
};

export default function About() {
  const { lang } = useParams<{ lang: string }>();
  const t = useI18n(lang ?? "en");

  console.log("About page rendered");

  useEffect(() => {
    console.log("About page mounted");
    return () => {
      console.log("About page unmounted");
    };
  }, []);

  return (
    <>
      <h1>{t.about}</h1>
      <img src="https://github.com/kebinbin.png" alt="Profile" />
      <Link to="/"> {t.goToHome} </Link>
    </>
  );
}
