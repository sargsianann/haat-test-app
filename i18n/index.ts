import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { languageDetector } from "./languageDetector";

import ar from "./locales/ar.json";
import en from "./locales/en-US.json";
import fr from "./locales/fr.json";
import he from "./locales/he.json";

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    resources: {
      "en-US": { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
      he: { translation: he },
    },
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
