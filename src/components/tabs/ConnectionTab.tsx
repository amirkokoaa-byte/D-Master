import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store';
import { Wifi, Activity, ArrowDownCircle, ShieldCheck, PlayCircle } from 'lucide-react';

export default function ConnectionTab() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const isRTL = language === 'ar';
  
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      // Simulate connecting to speed.cloudflare.com via proxy or mock
      const res = await fetch('/api/speedtest');
      const data = await res.json();
      
      // Artificial delay to make it look like a test is running
      setTimeout(() => {
        setResult(data);
        setTesting(false);
      }, 2500);

    } catch (e) {
      console.error(e);
      setTesting(false);
    }
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('Connection Test')}</h2>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
        <Wifi className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {isRTL ? 'اختبار السرعة من خلال موقع speed.cloudflare.com مجانا' : 'Test your speed through speed.cloudflare.com for free via the app.'}
        </p>

        {!result && (
          <button 
            onClick={startTest}
            disabled={testing}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-xl transition-all flex items-center justify-center mt-6"
          >
            {testing ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white rtl:ml-3 rtl:mr-[-4px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : <PlayCircle className={(isRTL ? "ml-2" : "mr-2") + " w-5 h-5"} />}
            {t('Start Test')}
          </button>
        )}

        {result && (
          <div className="mt-8">
            <div className="text-6xl font-black text-blue-500 mb-2">
              {result.download_speed}
            </div>
            <div className="text-sm text-slate-500 mb-8">Mb/s</div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">{t('Latency')}:</span> <span className="font-medium dark:text-slate-200">{result.latency}ms</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">{t('TLS Security')}:</span> <span className="font-medium dark:text-slate-200">{result.tls}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">{t('Protocol')}:</span> <span className="font-medium dark:text-slate-200">{result.protocol}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">{t('Resume')}:</span> <span className="font-medium dark:text-slate-200">{result.resume}</span>
              </div>
            </div>
            
            <button 
              onClick={startTest}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all"
            >
              {isRTL ? 'إعادة الاختبار' : 'Test Again'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
