import React from 'react';
import { useTranslation } from '../i18n';
import { cn } from '../lib/utils';
import { 
  Link, 
  Download, 
  History, 
  ShieldCheck, 
  Settings, 
  Bell, 
  Palette, 
  Wifi, 
  Info 
} from 'lucide-react';
import { useAppStore } from '../store';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ isOpen, activeTab, setActiveTab }: SidebarProps) {
  const { t } = useTranslation();
  const { language } = useAppStore();

  const isRTL = language === 'ar';

  const menuItems = [
    { id: 'links', label: t('Links'), icon: Link },
    { id: 'downloads', label: t('Downloads'), icon: Download },
    { id: 'history', label: t('History'), icon: History },
    { id: 'security', label: t('Security'), icon: ShieldCheck },
    { id: 'general', label: t('General'), icon: Settings },
    { id: 'notifications', label: t('Notifications'), icon: Bell },
    { id: 'appearance', label: t('Appearance'), icon: Palette },
    { id: 'connection', label: t('Connection Test'), icon: Wifi },
    { id: 'about', label: t('About'), icon: Info },
  ];

  return (
    <div 
      className={cn(
        "fixed md:absolute top-0 w-[280px] h-full bg-slate-50 dark:bg-slate-800 border-r dark:border-slate-700 shadow-xl z-20 transition-transform duration-300 ease-in-out font-sans flex flex-col p-5",
        isRTL ? "right-0" : "left-0",
        // Mobile sidebar logic
        isOpen 
          ? "translate-x-0" 
          : isRTL ? "translate-x-full md:translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mb-8 flex items-center justify-center md:justify-start">
        <div className="bg-blue-500 rounded-xl p-2 mr-3 rtl:ml-3 rtl:mr-0">
          <Download className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">D-Master</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-500 text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isRTL ? "ml-3" : "mr-3", isActive ? "text-white" : "text-slate-500 dark:text-slate-400")} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 bg-blue-600 text-white p-4 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <span className="text-lg">☁️🚫</span>
            <b>{t('Security Note')}</b>
          </div>
          <p className="opacity-90 leading-relaxed font-medium">
             {t('Storage Note')}. {t('Privacy Note')}.
          </p>
        </div>

      </div>

      <div className="mt-auto pt-5 border-t border-slate-200 dark:border-slate-700">
        <div className="flex justify-between text-[11px] mb-1 font-medium text-slate-700 dark:text-slate-300">
          <span>{t('Storage Info')}</span>
          <span>65%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden my-2">
          <div className="h-full bg-blue-500 w-[65%]"></div>
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">
          {t('Used')}: 124GB | {t('Available')}: 76GB
        </div>
        <div className="text-[11px] mt-4 text-slate-500 dark:text-slate-400 leading-snug">
          {t('Greetings')}<br/>
          {t('Made in Egypt')} 🇪🇬 v2.4.1
        </div>
      </div>
    </div>
  );
}
