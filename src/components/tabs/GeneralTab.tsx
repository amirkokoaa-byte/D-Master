import React from 'react';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇪🇬' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export default function GeneralTab() {
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();

  return (
    <div className="max-w-2xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('General')}</h2>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold dark:text-white">{t('App Language')}</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                language === lang.code 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 outline-none'
              }`}
            >
              <span className="font-medium dark:text-white">{lang.name}</span>
              <span className="text-2xl">{lang.flag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
