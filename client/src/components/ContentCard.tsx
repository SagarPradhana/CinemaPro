import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, Play } from 'lucide-react';
import { Movie, Music, Series, Comic, MusicVideo } from '@/types';

interface ContentCardProps {
  data: Movie | Music | Series | Comic | MusicVideo;
  type: 'movie' | 'music' | 'series' | 'comic' | 'drama' | 'anime' | 'music-video';
}

export default function ContentCard({ data, type }: ContentCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  const link = `/${
    type === 'drama' ? 'dramas' : 
    type === 'comic' ? 'comics' : 
    type === 'series' ? 'series' : 
    type === 'music' ? 'music' : 
    type === 'anime' ? 'anime' : 
    type === 'music-video' ? 'music-videos' :
    'movies'
  }/${data._id}`;
  const imageUrl = (data as any).posterImage || (data as any).coverImage;

  const getBadge = () => {
    if (data.isFeatured) return { label: 'Top', class: 'bg-[#B8892A]' };
    if (data.isLatest) return { label: 'New', class: 'bg-[#5B3FD4]' };
    return { label: 'Hot', class: 'bg-[#C94070]' };
  };

  const badge = getBadge();

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="group relative bg-white border border-[#E8DDD0] rounded-[20px] overflow-hidden p-0 h-full shadow-sm hover:shadow-2xl transition-shadow duration-500"
    >
      <div 
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="h-full"
      >
      <Link to={link} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {/* Unique Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-90`} />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[38px] opacity-20">🎬</span>
          </div>

          {imageUrl && (
            <img
              src={imageUrl}
              alt={data.title}
              className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-110"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20" />
          
          <div className={`absolute top-4 left-4 ${badge.class} text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-30 shadow-lg`}>
            {badge.label}
          </div>

          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 translate-y-2 group-hover:translate-y-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xl">
              <Play className="w-4 h-4 text-[#B8892A] fill-current" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-body font-semibold text-[13px] text-[#1A1510] mb-2 line-clamp-1 group-hover:text-[#B8892A] transition-colors uppercase tracking-tight">
            {data.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[#8A7A65] text-[11px] font-medium uppercase tracking-widest">
              {(data as any).genre?.[0] || type}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#B8892A] text-[#B8892A]" />
              <span className="text-[#B8892A] text-[11px] font-black">{(data as any).rating?.toFixed(1) || '8.5'}</span>
            </div>
          </div>
        </div>
      </Link>
      </div>
    </motion.div>
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="rounded-[20px] border border-[#E8DDD0] overflow-hidden bg-white animate-pulse">
      <div className="aspect-[4/3] bg-[#F5F0E8]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-[#F5F0E8] rounded" />
        <div className="h-3 w-1/2 bg-[#F5F0E8] rounded" />
      </div>
    </div>
  );
}