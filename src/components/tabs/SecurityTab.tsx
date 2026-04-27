import React from 'react';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store';
import { Shield, CloudOff, FolderOpen, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function SecurityTab() {
  const { t } = useTranslation();
  const { safeModeTouchId, setSafeModeTouchId, language } = useAppStore();
  const isRTL = language === 'ar';

  return (
    <div className="max-w-2xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('Security')}</h2>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold dark:text-white">{t('Touch ID')}</h3>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={safeModeTouchId}
              onChange={(e) => setSafeModeTouchId(e.target.checked)}
            />
            <div className={cn(
              "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600",
              isRTL ? "after:right-[2px] peer-checked:after:-translate-x-full" : "after:left-[2px]"
            )}></div>
            <span className={cn("text-sm font-medium text-slate-900 dark:text-slate-300", isRTL ? "mr-3" : "ml-3")}>
              {safeModeTouchId ? t('Enable') : t('Disable')}
            </span>
          </label>
        </div>
        
        <div className="p-5 bg-blue-500 text-white space-y-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <CloudOff className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{t('Security Note')}</p>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <FolderOpen className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{t('Storage Note')}</p>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <EyeOff className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{t('Privacy Note')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
