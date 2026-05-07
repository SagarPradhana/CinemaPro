import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Heart, Calendar, Clock, User, Tv, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { cn } from '@/lib/utils';
import { fetchMusicVideoById } from '@/store/musicVideoSlice';
import { addToStudio, removeFromStudio } from '@/store/studioSlice';
import { openPlayer } from '@/store/playerSlice';
import { useToast } from '@/components/ui/toaster';

export default function MusicVideoDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selected: video, loading } = useAppSelector((state) => state.musicVideos);
  const { items: studioItems } = useAppSelector((state) => state.studio);
  const { toast } = useToast();

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const isInStudio = video && studioItems.some(item => item._id === video._id);

  const toggleStudio = () => {
    if (!video) return;
    if (isInStudio) {
      dispatch(removeFromStudio(video._id));
      toast('Removed from Studio', 'warning');
    } else {
      dispatch(addToStudio({ ...video, itemType: 'music-video' }));
      toast('Added to your Studio', 'success');
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchMusicVideoById(id));
    }
  }, [dispatch, id]);

  if (loading || !video) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFAF5]">
      {/* Background Backdrop with Parallax */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {video.backdropImage || video.posterImage ? (
          <motion.div style={{ y }} className="h-full w-full">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src={video.backdropImage || video.posterImage}
              alt={video.title}
              className="h-[120%] w-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="h-full w-full bg-[#1A1510]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFAF5] via-[#FDFAF5]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFAF5] via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="-mt-[30vh] grid gap-16 lg:grid-cols-[400px_1fr] items-start">
          {/* Poster Side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-[40px] shadow-2xl border-8 border-white/50 backdrop-blur-md">
              {video.posterImage ? (
                <img
                  src={video.posterImage}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F5F0E8]">
                  <Tv className="h-20 w-20 text-[#B8892A]/20" />
                </div>
              )}
            </div>
            {/* Play Button Overlay */}
            {video.videoLink && (
              <button
                onClick={() => dispatch(openPlayer({ url: video.videoLink, title: video.title, type: 'video' }))}
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-20 h-20 rounded-full bg-[#B8892A] flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </button>
            )}
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-12"
          >
            <div className="flex flex-wrap gap-3 mb-8">
              {video.genre?.map((g) => (
                <span key={g} className="px-5 py-2 rounded-full bg-[#B8892A]/10 text-[#B8892A] text-[10px] font-black uppercase tracking-widest border border-[#B8892A]/20">
                  {g}
                </span>
              ))}
              <span className="px-5 py-2 rounded-full bg-[#1A1510] text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                Visual Masterpiece
              </span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-display font-black text-[#1A1510] mb-4 leading-none tracking-tighter">
              {video.title}
            </h1>
            <p className="text-3xl font-display font-bold text-[#B8892A] mb-12 italic opacity-80">
              by {video.artist}
            </p>

            <div className="flex flex-wrap items-center gap-10 mb-12">
              <div className="flex items-center gap-8 text-[#8A7A65]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-bold">{video.releaseYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-bold">{video.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              {video.videoLink && (
                <Button
                  onClick={() => dispatch(openPlayer({ url: video.videoLink, title: video.title, type: 'video' }))}
                  className="h-20 px-12 rounded-3xl bg-[#1A1510] text-white text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all gap-4"
                >
                  <Play className="h-6 w-6 fill-current" />
                  View Visuals
                </Button>
              )}
              <Button
                onClick={toggleStudio}
                variant="ghost"
                className={cn(
                  "w-20 h-20 rounded-full border-2 transition-all flex items-center justify-center",
                  isInStudio ? "bg-[#B8892A] border-[#B8892A] text-white" : "border-[#E8DDD0] hover:bg-white text-[#C94070]"
                )}
              >
                <Heart className={cn("h-6 w-6", isInStudio && "fill-current")} />
              </Button>
              <Button variant="ghost" className="w-20 h-20 rounded-full border-2 border-[#E8DDD0] hover:bg-white transition-all">
                <Share2 className="h-6 w-6 text-[#1A1510]" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Artist Profile Placeholder */}
        <div className="py-40">
          <h2 className="text-4xl font-display font-black text-[#1A1510] mb-16 tracking-tighter uppercase">Visual Artist Profile</h2>
          <div className="flex items-center gap-10 p-12 bg-white rounded-[40px] border border-[#E8DDD0] shadow-xl">
             <div className="w-40 h-40 rounded-full bg-[#F5F0E8] overflow-hidden flex items-center justify-center border-4 border-[#B8892A]/20">
                <User className="w-20 h-20 text-[#B8892A]/20" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B8892A] mb-2">Lead Artist</p>
                <h3 className="text-5xl font-display font-black text-[#1A1510] tracking-tighter">{video.artist}</h3>
                <p className="mt-4 text-[#8A7A65] font-medium max-w-xl italic opacity-70">Exploring the intersection of cinematic visuals and auditory landscapes. This performance marks a new era in visual storytelling.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
