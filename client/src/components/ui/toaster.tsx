import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addToast, removeToast } from '@/store/uiSlice';
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Toaster() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-4 pointer-events-none w-full max-w-[400px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => dispatch(removeToast(toast.id))} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({
  toast,
  onClose,
}: {
  toast: { id: string; message: string; type: 'success' | 'error' | 'warning' };
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-[#B8892A]" />,
    error: <AlertCircle className="h-5 w-5 text-[#C94070]" />,
    warning: <AlertTriangle className="h-5 w-5 text-[#5B3FD4]" />,
  };

  const themes = {
    success: 'bg-white/80 border-[#B8892A]/20 text-[#1A1510]',
    error: 'bg-[#C94070]/5 border-[#C94070]/20 text-[#C94070]',
    warning: 'bg-[#5B3FD4]/5 border-[#5B3FD4]/20 text-[#5B3FD4]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className={cn(
        'pointer-events-auto flex items-center gap-4 rounded-3xl border-2 px-6 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-2xl group',
        themes[toast.type]
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 blur-lg opacity-40 group-hover:opacity-100 transition-opacity">
          {icons[toast.type]}
        </div>
        <div className="relative">
          {icons[toast.type]}
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-40">Notification</p>
        <p className="text-[13px] font-bold tracking-tight">{toast.message}</p>
      </div>

      <button 
        onClick={onClose} 
        className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center text-[#1A1510]/30 hover:bg-[#1A1510] hover:text-white transition-all"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function useToast() {
  const dispatch = useAppDispatch();
  return {
    toast: (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      const id = Math.random().toString(36).substr(2, 9);
      dispatch(addToast({ id, message, type }));
    },
  };
}