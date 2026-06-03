import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import vi from "./locales/vi";
import en from "./locales/en";

const STORAGE_KEY = "app_language";
const translations = { vi, en };

const LanguageContext = createContext(null);

const resolveKey = (obj, path) =>
  path.split(".").reduce((acc, part) => acc?.[part], obj);

const interpolate = (str, params) => {
  if (!str || typeof str !== "string" || !params) return str;
  return Object.entries(params).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`{{${key}}}`, "g"), String(value)),
    str
  );
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "vi" ? "vi" : "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) setLanguageState(lang);
  }, []);

  const dict = translations[language];

  const t = useCallback(
    (key, params) => {
      const value = resolveKey(dict, key);
      if (typeof value === "string") return interpolate(value, params);
      return key;
    },
    [dict]
  );

  const ta = useCallback(
    (key) => {
      const value = resolveKey(dict, key);
      return Array.isArray(value) ? value : [];
    },
    [dict]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t, ta }),
    [language, setLanguage, t, ta]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};

export default LanguageContext;
