import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Heart, Star, Calendar, Clock, User, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { cn } from '@/lib/utils';
import { fetchMovieById } from '@/store/moviesSlice';
import { addToStudio, removeFromStudio } from '@/store/studioSlice';
import { openPlayer } from '@/store/playerSlice';
import { useToast } from '@/components/ui/toaster';
import axios from 'axios';
import { useState } from 'react';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selected: movie, loading } = useAppSelector((state) => state.movies);
  const { items: studioItems } = useAppSelector((state) => state.studio);
  const { toast } = useToast();

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const [externalData, setExternalData] = useState<any>(null);

  const isInStudio = movie && studioItems.some(item => item._id === movie._id);

  const toggleStudio = () => {
    if (!movie) return;
    if (isInStudio) {
      dispatch(removeFromStudio(movie._id));
      toast('Removed from Studio', 'warning');
    } else {
      dispatch(addToStudio({ ...movie, itemType: 'movie' }));
      toast('Added to your Studio', 'success');
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const fetchExternal = async () => {
      if (movie?.tmdbId) {
        try {
          const response = await axios.get(`/api/v1/movies/external/${movie.tmdbId}`);
          setExternalData(response.data);
        } catch (error) {
          console.error('Failed to fetch external TMDB data', error);
        }
      }
    };
    fetchExternal();
  }, [movie?.tmdbId]);

  if (loading || !movie) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FDFAF5]">
      {/* Background Backdrop with Parallax */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {movie.backdropImage || movie.posterImage ? (
          <motion.div style={{ y }} className="h-full w-full">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src={movie.backdropImage || movie.posterImage}
              alt={movie.title}
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
              {movie.posterImage ? (
                <img
                  src={movie.posterImage}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F5F0E8]">
                  <Film className="h-20 w-20 text-[#B8892A]/20" />
                </div>
              )}
            </div>
            {/* Play Button Overlay */}
            {movie.movieLink && (
              <button
                onClick={() => dispatch(openPlayer({ url: movie.movieLink || '', title: movie.title, type: 'video' }))}
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
              {movie.genre?.map((g) => (
                <span key={g} className="px-5 py-2 rounded-full bg-[#B8892A]/10 text-[#B8892A] text-[10px] font-black uppercase tracking-widest border border-[#B8892A]/20">
                  {g}
                </span>
              ))}
              {movie.language && (
                <span className="px-5 py-2 rounded-full bg-[#1A1510]/5 text-[#1A1510] text-[10px] font-black uppercase tracking-widest border border-[#1A1510]/10">
                  {movie.language}
                </span>
              )}
            </div>

            <h1 className="text-6xl lg:text-8xl font-display font-black text-[#1A1510] mb-8 leading-none tracking-tighter">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-10 mb-12">
              {movie.rating && (
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#E8DDD0]">
                  <Star className="h-5 w-5 fill-[#B8892A] text-[#B8892A]" />
                  <span className="text-2xl font-display font-black text-[#1A1510]">
                    {movie.rating.toFixed(1)}
                  </span>
                  <span className="text-xs font-black text-[#8A7A65] uppercase tracking-widest">/ 10 Rating</span>
                </div>
              )}
              <div className="flex items-center gap-8 text-[#8A7A65]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-bold">{movie.releaseYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-bold">{movie.duration}</span>
                </div>
              </div>
            </div>

            <p className="text-[#3D3020] text-xl leading-relaxed mb-12 max-w-3xl opacity-80 font-medium italic">
              "{movie.description}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 py-10 border-y border-[#E8DDD0]">
              {movie.director && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                    <User className="h-5 w-5 text-[#B8892A]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A7A65] mb-1">Director</p>
                    <p className="font-display font-bold text-xl text-[#1A1510]">{movie.director}</p>
                  </div>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                    <Film className="h-5 w-5 text-[#B8892A]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A7A65] mb-1">Starring</p>
                    <p className="font-display font-bold text-xl text-[#1A1510] truncate max-w-[200px]">{movie.cast.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6">
              {movie.movieLink && (
                <Button
                  onClick={() => dispatch(openPlayer({ url: movie.movieLink || '', title: movie.title, type: 'video' }))}
                  className="h-16 px-12 rounded-2xl bg-[#1A1510] text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all gap-4"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Watch Now
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

        {/* Casting Section */}
        <div className="py-40">
          <h2 className="text-4xl font-display font-black text-[#1A1510] mb-16 tracking-tighter">Full Ensemble Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {(externalData?.credits?.cast?.slice(0, 12) || movie.cast)?.map((actor: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center group"
              >
                <div className="w-32 h-32 rounded-full bg-[#F5F0E8] mb-4 border-2 border-[#E8DDD0] overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
                  {actor.profile_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                      alt={actor.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-[#B8892A]/20" />
                  )}
                </div>
                <p className="font-body font-black text-sm text-[#1A1510] text-center">{actor.name || actor}</p>
                {actor.character && (
                  <p className="font-body text-[10px] font-bold text-[#8A7A65] uppercase tracking-widest text-center mt-1">as {actor.character}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        {externalData?.recommendations?.results?.length > 0 && (
          <div className="pb-40">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-[#B8892A] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Curated for you</p>
                <h2 className="text-4xl font-display font-black text-[#1A1510] tracking-tighter">Similar Masterpieces</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {externalData.recommendations.results.slice(0, 5).map((rec: any) => (
                <motion.div
                  key={rec.id}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[2/3] rounded-[32px] overflow-hidden mb-4 shadow-xl relative">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`} 
                      alt={rec.title} 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-black">View Detail</Button>
                    </div>
                  </div>
                  <h3 className="font-display font-black text-[#1A1510] truncate uppercase text-xs tracking-tight">{rec.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-3 w-3 fill-[#B8892A] text-[#B8892A]" />
                    <span className="text-[10px] font-black text-[#8A7A65]">{rec.vote_average.toFixed(1)}</span>
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