import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';

interface ChapterViewerProps {
  chapterId: string;
  onClose: () => void;
  title: string;
}

export default function ChapterViewer({ chapterId, onClose, title }: ChapterViewerProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [baseUrl, setBaseUrl] = useState('');
  const [hash, setHash] = useState('');
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterPages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
        const { baseUrl, chapter } = response.data;
        setBaseUrl(baseUrl);
        setHash(chapter.hash);
        setPages(chapter.data);
      } catch (error) {
        console.error('Failed to fetch chapter pages:', error);
        setError('Failed to load live visuals. This chapter might be temporarily unavailable or restricted.');
      }
      setLoading(false);
    };

    fetchChapterPages();
  }, [chapterId]);

  const handleDownload = () => {
    // Basic implementation for downloading current page or chapter
    const currentUrl = `${baseUrl}/data/${hash}/${pages[currentPage]}`;
    const link = document.createElement('a');
    link.href = currentUrl;
    link.download = `chapter-${chapterId}-page-${currentPage + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#1A1510] flex flex-col"
    >
      {/* Header */}
      <div className="h-20 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 relative z-10">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-white/60 hover:text-white hover:bg-white/10">
              <X className="h-6 w-6" />
           </Button>
           <div>
              <h3 className="text-white font-display font-bold tracking-tight">{title}</h3>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Chapter Gallery · {pages.length} Pages</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="ghost" size="icon" onClick={() => setIsFullWidth(!isFullWidth)} className="rounded-full text-white/60 hover:text-white">
              {isFullWidth ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
           </Button>
           <Button onClick={handleDownload} variant="ghost" className="rounded-full text-white/60 hover:text-[#B8892A] gap-2 text-[10px] font-black uppercase tracking-widest">
              <Download className="h-4 w-4" /> Save
           </Button>
        </div>
      </div>

      {/* Viewer Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0D0B09] relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
             <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center p-10 text-center">
             <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8">
                <X className="h-12 w-12 text-red-500" />
             </div>
             <h3 className="text-3xl font-display font-black text-white mb-4 tracking-tighter">Transmission Interrupted</h3>
             <p className="text-white/40 max-w-md mx-auto mb-10 font-medium">{error}</p>
             <Button onClick={onClose} className="bg-white text-black px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px]">
                Return to Gallery
             </Button>
          </div>
        ) : (
          <div className={cn("mx-auto py-10 transition-all duration-500", isFullWidth ? "max-w-full" : "max-w-4xl")}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <img 
                  src={`${baseUrl}/data/${hash}/${pages[currentPage]}`} 
                  alt={`Page ${currentPage + 1}`}
                  className="w-full shadow-2xl rounded-sm"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="h-24 bg-black/60 backdrop-blur-2xl border-t border-white/10 flex items-center justify-center gap-8 relative z-10">
         <Button 
           disabled={currentPage === 0} 
           onClick={() => setCurrentPage(prev => prev - 1)}
           variant="ghost" 
           className="h-12 w-12 rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20"
         >
            <ChevronLeft className="h-8 w-8" />
         </Button>
         
         <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <span className="text-white font-bold">{currentPage + 1}</span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white/60 text-sm">{pages.length}</span>
         </div>

         <Button 
           disabled={currentPage === pages.length - 1} 
           onClick={() => setCurrentPage(prev => prev + 1)}
           variant="ghost" 
           className="h-12 w-12 rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20"
         >
            <ChevronRight className="h-8 w-8" />
         </Button>
      </div>
    </motion.div>
  );
}

// Helper function
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
