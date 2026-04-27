import React from 'react';
import { useTranslation } from '../../i18n';
import { Download, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store';

export default function AboutTab() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const isRTL = language === 'ar';

  const updates = [
    {
      version: '1.0.0',
      date: '2026-04-27',
      notes: isRTL 
        ? ['الإصدار الأولي', 'دعم أكثر من 10 لغات', 'تنزيل الفيديوهات بجودات متعددة حتى 4K', 'تنزيل الصوت كـ MP3/M4A', 'دعم الآلاف من المواقع عبر yt-dlp'] 
        : ['Initial Release', 'Over 10 languages support', 'Multiple quality support up to 4K', 'Download audio as MP3/M4A', 'yt-dlp integration supporting thousands of sites']
    }
  ];

  return (
    <div className="max-w-2xl animate-fade-in pb-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('About')}</h2>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-100 to-white dark:from-slate-700 dark:to-slate-800"></div>
        <div className="relative z-10">
          <div className="bg-blue-500 text-white w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
            <Download className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Downloader Master</h1>
          <p className="text-sm text-slate-500 mt-2">v1.0.0</p>
          <p className="font-semibold text-amber-600 dark:text-amber-500 mt-4">{t('Made in Egypt')} 🇪🇬</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t('Version History')}</h3>
      <div className="space-y-4">
        {updates.map((update, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-3">
              <span className="font-bold text-blue-600 dark:text-blue-400">v{update.version}</span>
              <span className="text-sm text-slate-500">{update.date}</span>
            </div>
            <ul className="space-y-2">
              {update.notes.map((note, j) => (
                <li key={j} className="flex items-start text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 mx-2" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
        <p className="text-slate-500 text-sm font-medium">{t('Greetings')}</p>
      </div>
    </div>
  );
}
