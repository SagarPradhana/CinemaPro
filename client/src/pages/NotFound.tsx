import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFAF5] flex items-center justify-center overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B8892A]/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, type: 'spring' }}
            className="mb-16"
          >
            <h1 className="text-[180px] lg:text-[240px] font-display font-black text-[#1A1510] leading-none tracking-tighter opacity-10">
              404
            </h1>
            <div className="mt-[-80px] lg:mt-[-120px]">
               <h2 className="text-4xl lg:text-6xl font-display font-black text-[#1A1510] tracking-tight uppercase">Scene Missing</h2>
               <p className="mt-6 text-[#8A7A65] font-medium uppercase tracking-[0.2em] text-xs font-black">The content you seek has wandered off script</p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center mb-24">
            <Link to="/">
              <Button className="h-16 px-12 rounded-2xl bg-[#1A1510] text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all gap-4">
                <Home className="h-5 w-5" />
                Return to Gallery
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="outline" className="h-16 px-12 rounded-2xl border-2 border-[#B8892A] text-[#B8892A] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#B8892A]/5 transition-all gap-4">
                <Search className="h-5 w-5" />
                Browse Archive
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {[
              { label: 'Cinematic', path: '/movies', count: 'Explore' },
              { key: 'music', label: 'Harmonic', path: '/music', count: 'Listen' },
              { label: 'Binge', path: '/series', count: 'Series' },
              { label: 'Script', path: '/comics', count: 'Read' },
            ].map((item) => (
              <Link key={item.path} to={item.path} className="group p-6 rounded-[32px] border border-[#E8DDD0] bg-white transition-all duration-500 hover:border-[#B8892A]/30 hover:shadow-2xl">
                <p className="font-display font-black text-[#1A1510] group-hover:text-[#B8892A] uppercase tracking-tighter transition-colors">{item.label}</p>
                <p className="text-[10px] font-black text-[#8A7A65] uppercase tracking-widest opacity-50">{item.count}</p>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}