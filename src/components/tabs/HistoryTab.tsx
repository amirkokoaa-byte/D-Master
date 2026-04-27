import React from 'react';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store';
import { FileDown, Calendar, FileType2, HardDrive, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function HistoryTab() {
  const { t } = useTranslation();
  const { downloads, clearHistory, language } = useAppStore();
  const isRTL = language === 'ar';

  const exportCSV = () => {
    // UTF-8 BOM for Excel
    const BOM = "\uFEFF";
    const header = "Name,URL,Type,Format,Quality,Status,Date\n";
    const rows = downloads.map(d => {
      const date = new Date(d.dateAdded).toLocaleString(isRTL ? 'ar-EG' : 'en-US');
      return `"${d.name}","${d.url}","${d.type}","${d.format}","${d.quality}","${d.status}","${date}"`;
    }).join("\n");
    
    const csvContent = BOM + header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "downloads_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in relative max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('History')}</h2>
        
        <div className="flex gap-2">
          {downloads.length > 0 && (
            <>
              <button 
                onClick={clearHistory}
                className="flex items-center px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition"
              >
                <Trash2 className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                {isRTL ? 'مسح السجل' : 'Clear History'}
              </button>
              <button 
                onClick={exportCSV}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FileDown className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                {t('Export CSV')}
              </button>
            </>
          )}
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p>{isRTL ? 'لا توجد تنزيلات سابقة' : 'No previous downloads'}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('Name')}</th>
                  <th scope="col" className="px-6 py-3">URL</th>
                  <th scope="col" className="px-6 py-3">{t('Quality')}</th>
                  <th scope="col" className="px-6 py-3">{t('Type')}</th>
                  <th scope="col" className="px-6 py-3">{t('Date')}</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((d) => (
                  <tr key={d.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white max-w-[200px] truncate" title={d.name}>
                      {d.name}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={d.url}>
                      {d.url}
                    </td>
                    <td className="px-6 py-4">
                      {d.quality.toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 rtl:ml-2 rtl:mr-0 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {d.format.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(d.dateAdded).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
