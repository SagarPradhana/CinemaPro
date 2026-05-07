import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, Trash2, Play, BookOpen, Music as MusicIcon, Film, Tv, Heart, LayoutGrid } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { removeFromStudio } from '@/store/studioSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function Studio() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.studio);

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const yHeader = useTransform(scrollY, [0, 500], [0, 100]);
  const yBlob = useTransform(scrollY, [0, 500], [0, 200]);

  const handleDownload = (item: any) => {
    const link = item.movieLink || item.musicLink || item.readLink || (item.chapters?.[0]?.readLink);
    if (link) {
      window.open(link, '_blank');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return Film;
      case 'music': return MusicIcon;
      case 'series': return Tv;
      case 'comic': return BookOpen;
      default: return LayoutGrid;
    }
  };

  const getDetailPath = (item: any) => {
    switch (item.itemType) {
      case 'movie': return `/movies/${item._id}`;
      case 'music': return `/music/${item._id}`;
      case 'series': return `/series/${item._id}`;
      case 'comic': return `/comics/${item._id}`;
      default: return '/';
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFAF5]">
      {/* Editorial Header with Parallax */}
      <div className="relative pt-20 pb-20 overflow-hidden bg-white border-b border-[#E8DDD0]">
        <motion.div
          style={{ y: yBlob }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B8892A]/5 blur-[120px] rounded-full"
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            style={{ y: yHeader }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1A1510] rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="text-[#B8892A] h-5 w-5 fill-current" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A7A65]">Personal Archive</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-display font-black text-[#1A1510] tracking-tighter uppercase leading-none">My Studio</h1>
              <p className="text-[#8A7A65] text-sm font-medium uppercase tracking-[0.2em] mt-4">Your curated collection of digital masterpieces</p>
            </div>

            <div className="bg-[#F5F0E8] p-6 rounded-[32px] border border-[#E8DDD0] flex items-center gap-10">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8A7A65] mb-1">Items</p>
                <p className="text-3xl font-display font-black text-[#1A1510]">{items.length}</p>
              </div>
              <div className="w-px h-10 bg-[#E8DDD0]" />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8A7A65] mb-1">Status</p>
                <p className="text-3xl font-display font-black text-[#B8892A]">Offline</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        {items.length === 0 ? (
          <div className="py-40 text-center">
            <div className="w-24 h-24 bg-[#F5F0E8] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#E8DDD0]">
              <Heart className="h-10 w-10 text-[#8A7A65]/30" />
            </div>
            <h3 className="text-3xl font-display font-black text-[#1A1510] mb-4">Studio Empty</h3>
            <p className="text-[#8A7A65] font-medium max-w-sm mx-auto italic mb-10">You haven't added any masterpieces to your studio yet. Start exploring the gallery.</p>
            <Link to="/">
              <Button className="h-14 px-10 rounded-2xl bg-[#1A1510] text-white font-black uppercase text-[10px] tracking-widest shadow-xl">
                Discover Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item, index) => {
              const Icon = getTypeIcon(item.itemType);
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-[40px] border border-[#E8DDD0] overflow-hidden transition-all duration-500 hover:shadow-3xl hover:-translate-y-2"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-[#F5F0E8]">
                    <img
                      src={(item as any).posterImage || (item as any).coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1510]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute top-6 left-6">
                      <Badge className="bg-white/90 backdrop-blur-md text-[#1A1510] border-none text-[8px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                        <Icon className="h-3 w-3 text-[#B8892A]" />
                        {item.itemType}
                      </Badge>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex gap-2">
                        <Link to={getDetailPath(item)} className="flex-1">
                          <Button className="w-full h-11 bg-white text-[#1A1510] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B8892A] hover:text-white transition-all gap-2">
                            <Play className="h-3 w-3 fill-current" /> Open
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleDownload(item)}
                          className="h-11 w-11 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-[#B8892A] transition-all"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-lg font-display font-black text-[#1A1510] line-clamp-1 uppercase tracking-tight mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-2 text-[#8A7A65]">
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.genre?.[0]}</span>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromStudio(item._id))}
                        className="p-2 text-[#8A7A65]/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
