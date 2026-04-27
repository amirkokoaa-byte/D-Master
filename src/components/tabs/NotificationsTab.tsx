import React from 'react';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store';
import { Bell, Volume2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function NotificationsTab() {
  const { t } = useTranslation();
  const { 
    notifySound, notifyComplete, notifyFailed, alertSound, 
    setNotificationsSettings, language 
  } = useAppStore();
  const isRTL = language === 'ar';

  const ToggleRow = ({ label, checked, onChange, icon: Icon, colorClass }: any) => (
    <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className={cn("p-2 rounded-lg", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium dark:text-white">{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={cn(
          "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600",
          isRTL ? "after:right-[2px] peer-checked:after:-translate-x-full" : "after:left-[2px]"
        )}></div>
      </label>
    </div>
  );

  return (
    <div className="max-w-2xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('Notifications')}</h2>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 mb-6">
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
          <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold dark:text-white">{t('Notifications')}</h3>
        </div>

        <div className="flex flex-col">
          <ToggleRow 
            label={t('Notification Sounds')} 
            checked={notifySound} 
            onChange={(val: boolean) => setNotificationsSettings({ notifySound: val })} 
            icon={Volume2} 
            colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          />
          <ToggleRow 
            label={t('Download Completed')} 
            checked={notifyComplete} 
            onChange={(val: boolean) => setNotificationsSettings({ notifyComplete: val })} 
            icon={CheckCircle} 
            colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          />
          <ToggleRow 
            label={t('Download Failed')} 
            checked={notifyFailed} 
            onChange={(val: boolean) => setNotificationsSettings({ notifyFailed: val })} 
            icon={XCircle} 
            colorClass="bg-red-500/10 text-red-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-lg font-semibold dark:text-white mb-4">{t('Alert Sound')}</h3>
        <select 
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3"
          value={alertSound}
          onChange={(e) => setNotificationsSettings({ alertSound: e.target.value })}
        >
          <option value="default">{isRTL ? 'الافتراضي' : 'Default'}</option>
          <option value="chime">{isRTL ? 'رنين' : 'Chime'}</option>
          <option value="pop">{isRTL ? 'فرقعة' : 'Pop'}</option>
          <option value="bell">{isRTL ? 'جرس' : 'Bell'}</option>
        </select>
        <button className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
          {isRTL ? 'تشغيل الصوت' : 'Play Sound'}
        </button>
      </div>
    </div>
  );
}
