import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import "./language-switcher.css";

const LanguageSwitcher = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`lang-switcher ${className}`} role="group" aria-label="Language">
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={language === "vi" ? "active" : ""}
        onClick={() => setLanguage("vi")}
      >
        VI
      </button>
    </div>
  );
};

export default LanguageSwitcher;
