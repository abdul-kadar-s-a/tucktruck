import { useState } from 'react';
import { Globe, Check } from 'lucide-react';

export type Language = 'en' | 'ta' | 'hi' | 'te';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు' },
];

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === currentLanguage);

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-700">{currentLang?.nativeName}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    currentLanguage === lang.code
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium">{lang.nativeName}</p>
                    <p className="text-xs text-gray-500">{lang.name}</p>
                  </div>
                  {currentLanguage === lang.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
