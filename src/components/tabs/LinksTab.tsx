import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { useAppStore, DownloadItem } from '../../store';
import { Download, Copy, Play, Loader2, Youtube, Facebook, Instagram, Twitter, Music, Video, Pause, StopCircle } from 'lucide-react';
import { socket } from '../../App';
import { cn } from '../../lib/utils';

export default function LinksTab() {
  const { t } = useTranslation();
  const { addDownload, updateDownload, downloads, autoDownload, speedLimit, concurrentDownloads, language } = useAppStore();
  const isRTL = language === 'ar';
  
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState<'4k'|'1080p'|'720p'|'480p'|'360p'|'144p'|'audio-only'>('1080p');
  const [format, setFormat] = useState<'mp4'|'mp3'|'m4a'|'webm'>('mp4');

  useEffect(() => {
    socket.on('download_progress', (data) => {
      updateDownload(data.id, {
        downloadedBytes: data.downloaded,
        totalBytes: data.total,
        speedBytesPerSec: data.speed,
        status: 'downloading'
      });
    });

    socket.on('download_complete', (data) => {
      updateDownload(data.id, { status: 'completed' });
    });

    socket.on('download_failed', (data) => {
      updateDownload(data.id, { status: 'failed' });
    });

    return () => {
      socket.off('download_progress');
      socket.off('download_complete');
      socket.off('download_failed');
    };
  }, [updateDownload]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const activeDownloadsCount = downloads.filter(d => d.status === 'downloading').length;

  const startDownload = () => {
    if (!url) return;
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Attempt extracting name from url if possible. Let's just create a nice display name.
    let name = "Video Download";
    if (url.includes('youtube.com') || url.includes('youtu.be')) name = "YouTube Video";
    if (url.includes('facebook.com')) name = "Facebook Video";
    if (url.includes('twitter.com') || url.includes('x.com')) name = "Twitter Video";
    if (url.includes('instagram.com')) name = "Instagram Video";
    if (url.includes('tiktok.com')) name = "TikTok Video";
    
    const isAudioOnly = quality === 'audio-only';
    const finalFormat = isAudioOnly ? (format === 'mp4' ? 'mp3' : format) : format;

    const newDownload: DownloadItem = {
      id,
      url,
      name: `${name} - ${isAudioOnly ? 'Audio' : quality}`,
      type: isAudioOnly ? 'audio' : 'video',
      format: finalFormat,
      quality,
      status: activeDownloadsCount >= concurrentDownloads ? 'queued' : 'downloading',
      downloadedBytes: 0,
      totalBytes: (isAudioOnly ? 5 : Math.random() * 500 + 50) * 1024 * 1024, // Random size between 50MB and 550MB
      speedBytesPerSec: 0,
      dateAdded: Date.now(),
      tags: [],
    };

    addDownload(newDownload);

    if (newDownload.status === 'downloading') {
      socket.emit('start_download', { 
        id, url, format: finalFormat, speedLimit, simulatedSize: newDownload.totalBytes 
      });
    }

    setUrl('');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      
      {/* Platform Icons Support */}
      <div className="flex justify-center flex-wrap gap-4 mb-8 grayscale opacity-50">
        <Youtube className="w-8 h-8" />
        <Facebook className="w-8 h-8" />
        <Twitter className="w-8 h-8" />
        <Instagram className="w-8 h-8" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 mb-6">
        
        <div className="flex flex-col md:flex-row gap-3 mb-4 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
          <div className="relative flex-1 flex items-center">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('Paste Link Here')}
              className="w-full bg-transparent border-0 text-slate-900 dark:text-white focus:ring-0 block px-4 py-2 text-base outline-none"
              dir="ltr"
            />
            <button 
              onClick={handlePaste}
              className={cn("p-2 text-slate-500 hover:text-white bg-slate-200 dark:bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-300 dark:border-slate-600 ml-2 rtl:mr-2")}
              title={t('Paste Link')}
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={startDownload}
            disabled={!url}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center whitespace-nowrap"
          >
            <Download className={cn("w-5 h-5", isRTL ? "ml-2" : "mr-2")} />
            {t('Download')}
          </button>
        </div>

        <div className="flex flex-wrap gap-5 mt-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('Quality')}:</label>
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none"
            >
              <option value="4k">4K Ultra HD (2160p)</option>
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p HD</option>
              <option value="480p">480p Standard</option>
              <option value="360p">360p Low</option>
              <option value="144p">144p Small</option>
              <option value="audio-only">Audio Only (MP3/M4A)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Format Ext.:</label>
            <select 
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none"
            >
              {quality === 'audio-only' ? (
                <>
                  <option value="mp3">MP3</option>
                  <option value="m4a">M4A</option>
                </>
              ) : (
                <>
                  <option value="mp4">MP4</option>
                  <option value="webm">WEBM</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Active Downloads List */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-xl font-bold flex items-center text-slate-900 dark:text-white">
          {t('Downloads')} 
          <span className="bg-blue-100 text-blue-800 text-sm font-medium mx-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {downloads.length}
          </span>
        </h3>
        <div className="relative">
          <button 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            onClick={(e) => {
              e.currentTarget.nextElementSibling?.classList.toggle('hidden');
            }}
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50">
             <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 font-semibold">{t('List')}</div>
             <button className="w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">{t('Files')}</button>
             <button className="w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">{t('Folders')}</button>
             <button className="w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">{t('Show Hidden Items')}</button>
             <div className="px-4 py-2 border-t border-b border-slate-100 dark:border-slate-700 font-semibold mt-2">{t('Sort Ascending')}</div>
             <button className="w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">{t('Name')}</button>
             <button className="w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">{t('Type')}</button>
             <button className="w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">{t('Date')}</button>
             <button className="w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">{t('Size')}</button>
             <button className="w-full text-left rtl:text-right px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">{t('Tags')}</button>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 relative z-0">
        {downloads.slice(0, 10).map((dl) => (
          <div key={dl.id} className="bg-slate-100 dark:bg-slate-900 rounded-xl p-3 flex flex-col md:flex-row items-center gap-4">
            <div className={cn("w-[60px] h-[40px] rounded flex items-center justify-center flex-shrink-0", dl.type === 'audio' ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-700 text-blue-400")}>
               {dl.type === 'audio' ? <Music className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </div>
            
            <div className="flex-1 w-full truncate">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px] md:max-w-[400px]" title={dl.name}>{dl.name}</span>
                <span className="text-xs text-blue-500">{dl.status === 'downloading' ? `${((dl.downloadedBytes / dl.totalBytes) * 100).toFixed(0)}%` : dl.quality.toUpperCase()}</span>
              </div>
              
              {dl.status === 'completed' && <span className="text-sm text-green-500 font-medium">{isRTL ? 'إكتمل' : 'Completed'}</span>}
              {dl.status === 'failed' && <span className="text-sm text-red-500 font-medium">{isRTL ? 'فشل' : 'Failed'}</span>}
              {dl.status === 'queued' && <span className="text-sm text-amber-500 font-medium">{isRTL ? 'في الإنتظار' : 'Queued'}</span>}
              {dl.status === 'downloading' && (
                <>
                  <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-1 mt-1 mb-1">
                    <div className={cn("h-1 rounded-full", dl.type === 'audio' ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${(dl.downloadedBytes / dl.totalBytes) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{(dl.downloadedBytes / 1024 / 1024).toFixed(1)} / {(dl.totalBytes / 1024 / 1024).toFixed(1)} MB</span>
                    <span>{(dl.speedBytesPerSec / 1024 / 1024).toFixed(2)} MB/s</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 justify-end">
              {(dl.status === 'downloading' || dl.status === 'queued') && (
                <button 
                  onClick={() => socket.emit('cancel_download', { id: dl.id })}
                  className="p-2 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
