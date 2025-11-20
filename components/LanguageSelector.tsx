
import React from 'react';
import { LANGUAGES } from '../constants';
// Fix: The Language type is exported from `types.ts`, not `constants.ts`.
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage, disabled }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = LANGUAGES.find(lang => lang.code === event.target.value);
    if (selectedLang) {
      onSelectLanguage(selectedLang);
    }
  };

  return (
    <div className="w-full sm:w-auto flex-grow">
      <label htmlFor="language-select" className="sr-only">
        Translate to:
      </label>
      <select
        id="language-select"
        value={selectedLanguage.code}
        onChange={handleChange}
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
