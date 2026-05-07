import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, Heart, Star } from 'lucide-react';
import { Movie } from '@/types';
import { openPlayer } from '@/store/playerSlice';
import { useDispatch } from 'react-redux';

interface HeroSectionProps {
  featured: Movie[];
}

export default function HeroSection({ featured }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const dispatch = useDispatch();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[currentIndex];

  return (
    <div ref={containerRef} className="relative w-full h-[740px] overflow-hidden flex items-center bg-gradient-to-br from-[#FDFAF5] via-[#F5EDD8] to-[#EEE3F5]">
      {/* Animated Parallax Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[#B8892A]/5 blur-[100px]"
        />
        <motion.div
          style={{ y: y2 }}
          animate={{ scale: [1, 1.1, 1], y: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-150px] left-[20%] w-[500px] h-[500px] rounded-full bg-[#5B3FD4]/5 blur-[100px]"
        />
      </div>

      {/* Dot Mesh Overlay */}
      <motion.div style={{ opacity }} className="absolute inset-0 dot-mesh opacity-40" />

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content Side */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-3 px-5 py-1.5 rounded-full bg-[#B8892A]/10 text-[#B8892A] text-[10px] font-black uppercase tracking-[0.3em] mb-10 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B8892A] animate-pulse" />
              Now Streaming · Trending #1
            </div>

            <h1 className="text-7xl lg:text-[100px] font-display font-black text-[#1A1510] mb-10 leading-[0.9] tracking-tighter">
              {current.title.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.4 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <em className="font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-[#B8892A] to-[#E8527A] animate-gradient block mt-2">
                Digital Premiere
              </em>
            </h1>

            <div className="flex items-center gap-12 mb-12">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#B8892A] text-[#B8892A]" />
                <span className="text-[#1A1510] font-black text-xl">{current.rating?.toFixed(1)}</span>
                <span className="text-[#8A7A65] text-sm font-medium">/ 10</span>
              </div>
              <div className="flex gap-4">
                {current.genre?.map((g, i) => (
                  <span key={i} className="text-[#8A7A65] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 bg-[#EDE6D8]/50 rounded-md">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[#3D3020] text-xl leading-relaxed mb-12 max-w-xl opacity-80 font-medium">
              {current.description}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => dispatch(openPlayer({ url: current.movieLink || current.trailerLink || '', title: current.title, type: 'video' }))}
                className="px-12 py-6 rounded-2xl bg-[#1A1510] text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#1A1510]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
              >
                <Play className="w-5 h-5 fill-current" />
                ▶ Watch Now
              </button>
              <button className="px-12 py-6 rounded-2xl border-2 border-[#B8892A] text-[#B8892A] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#B8892A]/5 transition-all flex items-center gap-4">
                <Heart className="w-5 h-5" />
                ♡ Add to List
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Visual Side with Scroll-triggered Parallax */}
        <motion.div
          style={{ 
            y: y2,
            perspective: "1000px"
          } as any}
          className="hidden lg:flex justify-end relative h-full"
        >
          <div className="relative w-[500px] h-[600px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {[0, 1, 2].map((offset) => {
              const item = featured[(currentIndex + offset) % featured.length];
              const rotations = [0, 12, -12];
              const xOffsets = [0, 80, -80];
              const scale = [1, 0.9, 0.8];
              const z = [0, -100, -200];
              return (
                <motion.div
                  key={item._id}
                  className="absolute rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/30 w-[320px] aspect-[2/3]"
                  initial={{ opacity: 0, x: 100, rotateY: rotations[offset] }}
                  animate={{
                    opacity: 1,
                    x: xOffsets[offset],
                    rotateY: rotations[offset],
                    z: z[offset],
                    y: [0, -20, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    delay: offset * 0.1,
                    y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  style={{ zIndex: 10 - offset, scale: scale[offset] } as any}
                  whileHover={{ 
                    scale: scale[offset] + 0.05, 
                    rotateY: 0, 
                    z: 50,
                    transition: { duration: 0.4 }
                  }}
                >
                  <img src={item.posterImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <p className="text-[#B8892A] text-[10px] font-black uppercase tracking-widest mb-2">{item.genre?.[0]}</p>
                    <h4 className="text-white font-display font-black text-2xl tracking-tighter">{item.title}</h4>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-12 flex items-center gap-3">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-10 bg-[#B8892A]' : 'w-3 bg-[#B8892A]/20'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

