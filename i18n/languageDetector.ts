import * as Localization from "expo-localization";
import type { LanguageDetectorAsyncModule } from "i18next";

const LANGUAGE_MAP: Record<string, string> = {
  en: "en-US",
  "en-AM": "en-US",
  fr: "fr",
  ar: "ar",
  he: "he",
};

export const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: (callback: (lang: string) => void) => {
    const rawLocale = Localization.getLocales()[0]?.languageTag ?? "en-US";
    const detectedLang = LANGUAGE_MAP[rawLocale] || "en-US";
    callback(detectedLang);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
