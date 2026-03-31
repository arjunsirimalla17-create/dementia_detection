import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem("preferredLanguage", newLang);
  };

  return (
    <div className="relative flex items-center gap-2">
      <Globe size={18} className="text-textMuted" />
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="bg-transparent text-textPrimary text-sm font-medium border-none focus:ring-0 cursor-pointer appearance-none outline-none py-1 pr-6"
      >
        <option value="en">EN 🇺🇸</option>
        <option value="hi">हिं 🇮🇳</option>
        <option value="te">తె 🇮🇳</option>
      </select>
      {/* Custom Chevron since native is hidden by appearance-none */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-textMuted">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
