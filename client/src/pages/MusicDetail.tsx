import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Heart, Calendar, Music2, Headphones, Music, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchMusicById } from '@/store/musicSlice';
import { addToStudio, removeFromStudio } from '@/store/studioSlice';
import { openPlayer } from '@/store/playerSlice';
import { useToast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export default function MusicDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selected: music, loading } = useAppSelector((state) => state.music);
  const { items: allMusic } = useAppSelector((state) => state.music);
  const { items: studioItems } = useAppSelector((state) => state.studio);
  const { toast } = useToast();

  const isInStudio = music && studioItems.some(item => item._id === music._id);

  const toggleStudio = () => {
    if (!music) return;
    if (isInStudio) {
      dispatch(removeFromStudio(music._id));
      toast('Removed from Studio', 'warning');
    } else {
      dispatch(addToStudio({ ...music, itemType: 'music' }));
      toast('Added to your Studio', 'success');
    }
  };

  const handlePlay = () => {
    if (music?.musicLink) {
      const playlist = allMusic
        .filter(m => m.musicLink)
        .map(m => ({
          _id: m._id,
          url: m.musicLink!,
          title: m.title,
          type: 'audio' as const
        }));
      dispatch(openPlayer({ 
        url: music.musicLink, 
        title: music.title, 
        type: 'audio',
        playlist: playlist.length > 0 ? playlist : undefined
      }));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchMusicById(id));
    }
  }, [dispatch, id]);

  if (loading || !music) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      {/* Background Backdrop with animated blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#B8892A]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#C94070]/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 pt-40 pb-20 relative z-10">
        <div className="grid gap-20 lg:grid-cols-[450px_1fr] items-center">
          {/* Cover Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden rounded-[60px] shadow-[0_50px_100px_-20px_rgba(184,137,42,0.2)] border-4 border-white">
              {music.coverImage ? (
                <img
                  src={music.coverImage}
                  alt={music.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FDF3DC] to-[#FDE8EF]">
                  <Music2 className="h-32 w-32 text-[#B8892A]/20" />
                </div>
              )}
            </div>

          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex flex-wrap gap-4 mb-10">
              {music.genre?.map((g) => (
                <span key={g} className="px-6 py-2 rounded-full bg-white border border-[#E8DDD0] text-[#8A7A65] text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {g}
                </span>
              ))}
              <span className="px-6 py-2 rounded-full bg-[#1A1510] text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                Premium Audio
              </span>
            </div>

            <h1 className="text-7xl lg:text-9xl font-display font-black text-[#1A1510] mb-4 leading-none tracking-tighter">
              {music.title}
            </h1>
            <p className="text-3xl font-display font-bold text-[#B8892A] mb-12 italic opacity-80">
              by {music.artist}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 p-8 rounded-[32px] bg-white/50 backdrop-blur-xl border border-white shadow-2xl shadow-[#B8892A]/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8A7A65] mb-2 opacity-50">Release</p>
                <div className="flex items-center gap-2 text-[#1A1510]">
                  <Calendar className="h-4 w-4" />
                  <span className="font-bold">{music.releaseYear}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8A7A65] mb-2 opacity-50">Length</p>
                <div className="flex items-center gap-2 text-[#1A1510]">
                  <Music className="h-4 w-4" />
                  <span className="font-bold">{music.duration}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8A7A65] mb-2 opacity-50">Audience</p>
                <div className="flex items-center gap-2 text-[#1A1510]">
                  <Headphones className="h-4 w-4" />
                  <span className="font-bold">{music.plays?.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#8A7A65] mb-2 opacity-50">Language</p>
                <div className="flex items-center gap-2 text-[#1A1510]">
                  <span className="font-bold uppercase">{music.language || 'INT'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <Button
                onClick={handlePlay}
                className="h-16 px-10 rounded-2xl bg-[#B8892A] text-white font-black uppercase text-[12px] tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(184,137,42,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
              >
                <Play className="h-6 w-6 fill-current" />
                Begin Experience
              </Button>
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

        {/* Content Tabs (Lyrics / Album) */}
        <div className="mt-40 grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[40px] bg-white border border-[#E8DDD0] shadow-xl"
          >
            <h2 className="text-3xl font-display font-black text-[#1A1510] mb-8 tracking-tighter">Poetic Composition</h2>
            <div className="h-[400px] overflow-y-auto pr-8 custom-scrollbar">
              <pre className="whitespace-pre-wrap font-body text-xl leading-loose text-[#3D3020] opacity-70 italic">
                {music.lyrics || "Lyrics are being transcribed for this masterpiece..."}
              </pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-4xl font-display font-black text-[#1A1510] mb-6 tracking-tighter uppercase">From the Album</h2>
            <p className="text-6xl font-display font-black text-[#B8892A] mb-12 opacity-90 leading-tight">
              {music.album || "Masterpiece Singles"}
            </p>

            <div className="space-y-4">
              {music.tags?.map((tag) => (
                <span key={tag} className="inline-block mr-3 mb-3 px-6 py-2 rounded-xl bg-[#F5F0E8] text-[#8A7A65] text-[10px] font-black uppercase tracking-[0.2em]">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}