import React from 'react';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store';
import { Moon, Sun, Monitor, Paintbrush } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AppearanceTab() {
  const { t } = useTranslation();
  const { theme, setTheme, dynamicColors, setDynamicColors } = useAppStore();

  const options = [
    { id: 'light', label: t('Light'), icon: Sun },
    { id: 'dark', label: t('Dark'), icon: Moon },
    { id: 'auto', label: t('Auto'), icon: Monitor },
  ] as const;

  return (
    <div className="max-w-2xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('Appearance')}</h2>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
            <Paintbrush className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold dark:text-white">{t('Appearance')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
                  theme === opt.id 
                    ? "border-blue-500 bg-blue-500/10 text-blue-500" 
                    : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                )}
              >
                <Icon className="w-8 h-8 mb-3" />
                <span className="font-semibold">{opt.label}</span>
              </button>
            )
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="font-medium dark:text-white">{t('Dynamic Colors')}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={dynamicColors}
                onChange={(e) => setDynamicColors(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto rtl:peer-checked:after:-translate-x-full after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
            </label>
        </div>
      </div>
    </div>
  );
}
