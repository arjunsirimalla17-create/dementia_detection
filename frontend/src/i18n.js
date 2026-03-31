import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./translations/en.json";
import translationHI from "./translations/hi.json";
import translationTE from "./translations/te.json";

const unwrap = (file) => file.translation || file;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: unwrap(translationEN) },
    hi: { translation: unwrap(translationHI) },
    te: { translation: unwrap(translationTE) },
  },
  lng: localStorage.getItem("preferredLanguage") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});
export default i18n;