import React, { useState, useEffect } from 'react';
import { useAppStore } from './store';
import { cn } from './lib/utils';
import Sidebar from './components/Sidebar';
import MainArea from './components/MainArea';
import { Menu } from 'lucide-react';
import { io } from 'socket.io-client';

export const socket = io('/', { autoConnect: false });

export default function App() {
  const { theme, language, dynamicColors } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('links');

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'glass-theme');
    
    let isDark = false;
    if (theme === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'dark' : 'light');
    } else {
      isDark = theme === 'dark';
      root.classList.add(theme);
    }

    if (isDark && dynamicColors) {
      root.classList.add('glass-theme');
    }
  }, [theme, dynamicColors]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 overflow-hidden font-sans relative">
      {/* Mobile Backdrop Overlay - closes sidebar when clicked outside */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-10 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile header / Sidebar toggle */}
      <div className="md:hidden absolute top-0 w-full h-16 flex items-center px-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10" style={{ right: language === 'ar' ? 0 : 'auto', left: language === 'ar' ? 'auto' : 0 }}>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h1 className={cn("font-bold text-lg text-slate-900 dark:text-white", language === 'ar' ? "mr-4" : "ml-4")}>Downloader Master</h1>
      </div>

      <Sidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={(t) => { setActiveTab(t); setSidebarOpen(false); }} 
      />

      <div className={cn(
        "flex-1 h-full overflow-y-auto transition-all duration-300 pt-16 md:pt-0 w-full",
        language === 'ar' ? "md:mr-[280px]" : "md:ml-[280px]"
      )}>
        <MainArea activeTab={activeTab} />
      </div>
    </div>
  );
}
