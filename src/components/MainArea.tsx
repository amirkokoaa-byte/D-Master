import React from 'react';
import { useAppStore } from '../store';
import LinksTab from './tabs/LinksTab';
import DownloadsTab from './tabs/DownloadsTab';
import HistoryTab from './tabs/HistoryTab';
import SecurityTab from './tabs/SecurityTab';
import GeneralTab from './tabs/GeneralTab';
import NotificationsTab from './tabs/NotificationsTab';
import AppearanceTab from './tabs/AppearanceTab';
import ConnectionTab from './tabs/ConnectionTab';
import AboutTab from './tabs/AboutTab';

interface MainAreaProps {
  activeTab: string;
}

export default function MainArea({ activeTab }: MainAreaProps) {
  const { language } = useAppStore();
  const isRTL = language === 'ar';

  const renderTab = () => {
    switch (activeTab) {
      case 'links': return <LinksTab />;
      case 'downloads': return <DownloadsTab />;
      case 'history': return <HistoryTab />;
      case 'security': return <SecurityTab />;
      case 'general': return <GeneralTab />;
      case 'notifications': return <NotificationsTab />;
      case 'appearance': return <AppearanceTab />;
      case 'connection': return <ConnectionTab />;
      case 'about': return <AboutTab />;
      default: return <LinksTab />;
    }
  };

  return (
    <div 
      className="p-4 md:p-8 w-full max-w-6xl mx-auto min-h-full flex flex-col gap-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {renderTab()}
    </div>
  );
}
