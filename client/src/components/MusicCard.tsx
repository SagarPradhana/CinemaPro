import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, Music as MusicIcon } from 'lucide-react';
import { Music } from '@/types';

import { useAppDispatch } from '@/hooks/useRedux';
import { openPlayer } from '@/store/playerSlice';

interface MusicCardProps {
  data: Music;
  isPlaying?: boolean;
}

export default function MusicCard({ data, isPlaying }: MusicCardProps) {
  const dispatch = useAppDispatch();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onClick={() => {
        if (data.musicLink) {
          dispatch(openPlayer({ url: data.musicLink, title: data.title, type: 'audio' }));
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative flex items-center gap-5 bg-white border border-[#E8DDD0] rounded-[20px] p-5 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-xl`}
    >
      <div 
        style={{
          transform: "translateZ(30px)",
          transformStyle: "preserve-3d",
        }}
        className="flex items-center gap-5 w-full"
      >
      <div className="relative w-[52px] h-[52px] rounded-[14px] overflow-hidden bg-gradient-to-br from-[#FDF3DC] to-[#FDE8EF] flex-shrink-0 border border-white">
        {data.coverImage ? (
          <img src={data.coverImage} alt={data.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MusicIcon className="w-6 h-6 text-[#B8892A]/30" />
          </div>
        )}
        
        {isPlaying && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-[2px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [0.5, 1.5, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                className="w-[2px] h-3 bg-[#F2C96A] rounded-full origin-bottom"
              />
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-current" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-body font-semibold text-[13px] text-[#1A1510] truncate group-hover:text-[#B8892A] transition-colors uppercase tracking-tight">
          {data.title}
        </h3>
        <p className="text-[#8A7A65] text-[11px] font-medium truncate opacity-70">
          {data.artist}
        </p>
      </div>

      <div className="text-[#8A7A65] text-[11px] font-black tracking-widest opacity-40">
        {data.duration || '03:45'}
      </div>
      </div>
    </motion.div>
  );
}
