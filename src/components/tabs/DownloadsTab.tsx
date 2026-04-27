import React, { useState } from 'react';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store';
import { Folder, DownloadCloud, HardDrive, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function DownloadsTab() {
  const { t } = useTranslation();
  const { 
    downloadsFolder, setDownloadsFolder,
    autoDownload, setAutoDownload,
    concurrentDownloads, setConcurrentDownloads,
    speedLimit, setSpeedLimit,
    language
  } = useAppStore();
  const isRTL = language === 'ar';
  const [showWarning, setShowWarning] = useState(false);
  const [pendingConcurrent, setPendingConcurrent] = useState(concurrentDownloads);

  const handleConcurrentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    if (val > 2) {
      setPendingConcurrent(val);
      setShowWarning(true);
    } else {
      setConcurrentDownloads(val);
    }
  };

  const confirmConcurrentChange = () => {
    setConcurrentDownloads(pendingConcurrent);
    setShowWarning(false);
  };

  // Mock storage info 
  // Normally we would use navigator.storage.estimate() but the prompt requests specific UI representation
  const usedStorage = 45; // GB
  const totalStorage = 120; // GB
  const availableStorage = totalStorage - usedStorage;
  
  const storageData = [
    { name: t('Used'), value: usedStorage, color: '#3b82f6' },
    { name: t('Available'), value: availableStorage, color: '#e5e7eb' },
  ];

  return (
    <div className="max-w-2xl animate-fade-in pb-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('Downloads')}</h2>

      <div className="space-y-6">
        {/* Save Folder & Auto Download */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="mb-6">
            <h3 className="text-lg font-semibold dark:text-white flex items-center mb-4">
              <Folder className={cn("w-5 h-5", isRTL ? "ml-2" : "mr-2")} />
              {t('Save Folder')}
            </h3>
            <button 
              className="w-full flex justify-between items-center px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              onClick={async () => {
                // Try file system access API if supported
                if ('showDirectoryPicker' in window) {
                  try {
                    // @ts-ignore
                    const dirHandle = await window.showDirectoryPicker();
                    setDownloadsFolder(dirHandle.name);
                  } catch (err) {
                    console.error(err);
                  }
                } else {
                  alert("Directory picker not supported in this preview environment. You can assume it opens standard dialog.");
                }
              }}
            >
              <span className="text-slate-700 dark:text-slate-300">
                {downloadsFolder === 'default' ? (isRTL ? 'مجلد الفيديوهات والصوتيات (الافتراضي)' : 'Device Video/Audio Folders (Default)') : downloadsFolder}
              </span>
              <Folder className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-slate-200 dark:border-slate-700">
            <span className="font-medium dark:text-white">{t('Start Download Automatically')}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autoDownload}
                onChange={(e) => setAutoDownload(e.target.checked)}
              />
              <div className={cn(
                "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600",
                isRTL ? "after:right-[2px] peer-checked:after:-translate-x-full" : "after:left-[2px]"
              )}></div>
            </label>
          </div>
        </div>

        {/* Concurrent Downloads & Speed */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="mb-6">
            <h3 className="text-lg font-semibold dark:text-white flex items-center mb-4">
              <DownloadCloud className={cn("w-5 h-5", isRTL ? "ml-2" : "mr-2")} />
              {t('Concurrent Downloads')}
            </h3>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3"
              value={showWarning ? pendingConcurrent : concurrentDownloads}
              onChange={handleConcurrentChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              {t('Speed Limit')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { val: 'unlimited', label: t('Unlimited') },
                { val: '256000', label: '256 KB/s' },
                { val: '512000', label: '512 KB/s' },
                { val: '1048576', label: '1 MB/s' },
                { val: '2097152', label: '2 MB/s' },
                { val: '5242880', label: '5 MB/s' },
                { val: '10485760', label: '10 MB/s' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setSpeedLimit(opt.val)}
                  className={cn(
                    "px-4 py-2 text-sm rounded-xl border font-medium transition-colors",
                    speedLimit === opt.val
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-center flex-col sm:flex-row">
          <div className="flex-1 w-full mb-6 sm:mb-0">
             <h3 className="text-lg font-semibold dark:text-white flex items-center mb-2">
                <HardDrive className={cn("w-5 h-5", isRTL ? "ml-2" : "mr-2")} />
                {t('Storage Info')}
              </h3>
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600 dark:text-slate-400">{t('Used')}: <strong className="text-slate-900 dark:text-white">{usedStorage} GB</strong></span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                  <span className="text-slate-600 dark:text-slate-400">{t('Available')}: <strong className="text-slate-900 dark:text-white">{availableStorage} GB</strong></span>
                </div>
              </div>
          </div>
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storageData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {storageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Concurrent warning modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 mb-4 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2 dark:text-white">{t('Concurrent Warning')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
              {t('Concurrent Warning')}
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button 
                onClick={() => {
                  setShowWarning(false);
                  setPendingConcurrent(concurrentDownloads);
                }}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                No
              </button>
              <button 
                onClick={confirmConcurrentChange}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                {t('OK')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
