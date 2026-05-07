import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, Calendar, BookOpen, Eye, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchComicById } from '@/store/comicsSlice';
import { addToStudio, removeFromStudio } from '@/store/studioSlice';
import { openPlayer } from '@/store/playerSlice';
import { useToast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import ChapterViewer from '@/components/ChapterViewer';

export default function ComicDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selected: comic, loading } = useAppSelector((state) => state.comics);
  const { items: studioItems } = useAppSelector((state) => state.studio);
  const { toast } = useToast();
  const [viewerChapter, setViewerChapter] = useState<{ id: string, title: string } | null>(null);
  const [externalChapters, setExternalChapters] = useState<any[]>([]);
  const [fetchingChapters, setFetchingChapters] = useState(false);

  const isInStudio = comic && studioItems.some(item => item._id === comic._id);

  const toggleStudio = () => {
    if (!comic) return;
    if (isInStudio) {
      dispatch(removeFromStudio(comic._id));
      toast('Removed from Studio', 'warning');
    } else {
      dispatch(addToStudio({ ...comic, itemType: 'comic' }));
      toast('Added to your Studio', 'success');
    }
  };

  useEffect(() => {
    if (id) dispatch(fetchComicById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (comic?.mangaDexId) {
      setFetchingChapters(true);
      const fetchChapters = async () => {
        try {
          const res = await axios.get(`https://api.mangadex.org/manga/${comic.mangaDexId}/feed`, {
            params: {
              translatedLanguage: ['en'],
              order: { chapter: 'desc' },
              limit: 50
            }
          });
          setExternalChapters(res.data.data);
        } catch (err) {
          console.error('Failed to fetch external chapters', err);
        }
        setFetchingChapters(false);
      };
      fetchChapters();
    }
  }, [comic?.mangaDexId]);

  if (loading || !comic) return <LoadingSpinner fullScreen />;

  const latestChapter = comic.chapters[comic.chapters.length - 1];

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      <AnimatePresence>
        {viewerChapter && (
          <ChapterViewer
            chapterId={viewerChapter.id}
            title={viewerChapter.title}
            onClose={() => setViewerChapter(null)}
          />
        )}
      </AnimatePresence>

      {/* Background Backdrop */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {comic.coverImage ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src={comic.coverImage}
            alt={comic.title}
            className="h-full w-full object-cover"
          />
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
            className="relative"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-[40px] shadow-2xl border-8 border-white/50 backdrop-blur-md">
              {comic.coverImage ? (
                <img
                  src={comic.coverImage}
                  alt={comic.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F5F0E8]">
                  <BookOpen className="h-20 w-20 text-[#B8892A]/20" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-12"
          >
            <div className="flex flex-wrap gap-3 mb-8">
              {comic.genre?.map((g) => (
                <span key={g} className="px-5 py-2 rounded-full bg-[#B8892A]/10 text-[#B8892A] text-[10px] font-black uppercase tracking-widest border border-[#B8892A]/20">
                  {g}
                </span>
              ))}
              <span className="px-5 py-2 rounded-full bg-[#1A1510]/5 text-[#1A1510] text-[10px] font-black uppercase tracking-widest border border-[#1A1510]/10">
                {comic.type}
              </span>
              <span className="px-5 py-2 rounded-full bg-white text-[#8A7A65] text-[10px] font-black uppercase tracking-widest border border-[#E8DDD0]">
                {comic.status}
              </span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-display font-black text-[#1A1510] mb-8 leading-none tracking-tighter">
              {comic.title}
            </h1>

            <div className="flex flex-wrap items-center gap-10 mb-12">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#E8DDD0]">
                <Eye className="h-5 w-5 text-[#B8892A]" />
                <span className="text-2xl font-display font-black text-[#1A1510]">
                  {comic.views}
                </span>
                <span className="text-xs font-black text-[#8A7A65] uppercase tracking-widest">/ Views</span>
              </div>
              <div className="flex items-center gap-8 text-[#8A7A65]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-bold">{comic.releaseYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-bold">{comic.chapters.length} Chapters</span>
                </div>
              </div>
            </div>

            <p className="text-[#3D3020] text-xl leading-relaxed mb-12 max-w-3xl opacity-80 font-medium italic">
              {comic.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 py-10 border-y border-[#E8DDD0]">
              {comic.author && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                    <User className="h-5 w-5 text-[#B8892A]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A7A65] mb-1">Author</p>
                    <p className="font-display font-bold text-xl text-[#1A1510]">{comic.author}</p>
                  </div>
                </div>
              )}
              {comic.artist && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                    <User className="h-5 w-5 text-[#B8892A]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A7A65] mb-1">Artist</p>
                    <p className="font-display font-bold text-xl text-[#1A1510]">{comic.artist}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6 mb-16">
              {latestChapter?.readLink && (
                <Button
                  onClick={() => dispatch(openPlayer({ url: latestChapter.readLink || '', title: comic.title, type: 'comic' }))}
                  className="h-16 px-12 rounded-2xl bg-[#1A1510] text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all gap-4"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Read Latest
                </Button>
              )}
              <Button
                onClick={toggleStudio}
                variant={isInStudio ? "default" : "outline"}
                className={cn(
                  "h-16 px-12 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all gap-4",
                  isInStudio ? "bg-[#B8892A] text-white" : "border-2 border-[#B8892A] text-[#B8892A] hover:bg-[#B8892A]/5"
                )}
              >
                <Heart className={cn("h-5 w-5", isInStudio && "fill-current")} />
                {isInStudio ? 'In Studio' : 'Add to List'}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Chapters Section */}
        {(comic.chapters.length > 0 || externalChapters.length > 0) && (
          <div className="py-32 border-t border-[#E8DDD0]">
            <div className="mb-16 flex items-end justify-between">
              <div>
                <h2 className="text-4xl font-display font-black text-[#1A1510] mb-4 tracking-tighter">Script Registry</h2>
                <p className="text-[#8A7A65] font-medium uppercase tracking-[0.2em] text-[10px] font-black">
                  {fetchingChapters ? 'Synchronizing with MangaDex...' : 'All serialized chapters in sequence'}
                </p>
              </div>
              {comic.mangaDexId && (
                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-violet-50 border border-violet-100">
                   <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">Live MangaDex Feed</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {/* Render Local Chapters */}
              {[...comic.chapters].reverse().map((chapter, index) => (
                <motion.div
                  key={chapter._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    if (chapter.mangaDexChapterId) {
                      setViewerChapter({ id: chapter.mangaDexChapterId, title: `${comic.title} - Chapter ${chapter.chapterNumber}` });
                    } else if (chapter.readLink) {
                      dispatch(openPlayer({ url: chapter.readLink, title: `${comic.title} - Chapter ${chapter.chapterNumber}`, type: 'comic' }));
                    } else {
                      toast('No reading link available', 'warning');
                    }
                  }}
                >
                  <div className="relative rounded-3xl bg-white border border-[#E8DDD0] p-6 transition-all duration-500 hover:shadow-2xl hover:border-[#B8892A]/30">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B8892A]">Chapter {chapter.chapterNumber}</p>
                      <div className="flex gap-2">
                        {chapter.mangaDexChapterId && (
                          <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-[#B8892A]/10 text-[#B8892A] px-2 py-1 rounded-md">
                            <Sparkles className="h-2 w-2" /> Live
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#1A1510] line-clamp-1 mb-4">{chapter.title || `Chapter ${chapter.chapterNumber}`}</h3>
                    <div className="flex items-center justify-between text-[#8A7A65] text-[10px] font-black uppercase tracking-widest opacity-60">
                      <span>{chapter.pages?.length || 'Digital'} Pages</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Render External MangaDex Chapters */}
              {externalChapters.filter(ext => !comic.chapters.some(c => c.chapterNumber === Number(ext.attributes.chapter))).map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (comic.chapters.length + index) * 0.03 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    setViewerChapter({ id: chapter.id, title: `${comic.title} - Chapter ${chapter.attributes.chapter}` });
                  }}
                >
                  <div className="relative rounded-3xl bg-violet-50/50 border border-violet-100 p-6 transition-all duration-500 hover:shadow-2xl hover:border-violet-300">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-violet-600">Chapter {chapter.attributes.chapter}</p>
                      <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-violet-600/10 text-violet-600 px-2 py-1 rounded-md">
                        <Sparkles className="h-2 w-2" /> Live Feed
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#1A1510] line-clamp-1 mb-4">{chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`}</h3>
                    <div className="flex items-center justify-between text-[#8A7A65] text-[10px] font-black uppercase tracking-widest opacity-60">
                      <span>MangaDex Stream</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}