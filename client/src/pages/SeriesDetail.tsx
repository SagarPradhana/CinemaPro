import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Heart, Star, Calendar, Tv, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchSeriesById } from '@/store/seriesSlice';
import { addToStudio, removeFromStudio } from '@/store/studioSlice';
import { openPlayer } from '@/store/playerSlice';
import { useToast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { User } from 'lucide-react';

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selected: series, loading } = useAppSelector((state) => state.series);
  const { items: studioItems } = useAppSelector((state) => state.studio);
  const { toast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState(1);

  const [externalData, setExternalData] = useState<any>(null);

  const isInStudio = series && studioItems.some(item => item._id === series._id);

  const toggleStudio = () => {
    if (!series) return;
    if (isInStudio) {
      dispatch(removeFromStudio(series._id));
      toast('Removed from Studio', 'warning');
    } else {
      dispatch(addToStudio({ ...series, itemType: 'series' }));
      toast('Added to your Studio', 'success');
    }
  };

  useEffect(() => {
    if (id) dispatch(fetchSeriesById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const fetchExternal = async () => {
      if (series?.tmdbId) {
        try {
          const response = await axios.get(`/api/v1/series/external/${series.tmdbId}`);
          setExternalData(response.data);
        } catch (error) {
          console.error('Failed to fetch external TMDB data', error);
        }
      }
    };
    fetchExternal();
  }, [series?.tmdbId]);

  if (loading || !series) return <LoadingSpinner fullScreen />;

  const currentSeason = series.seasons.find(s => s.seasonNumber === selectedSeason);

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      {/* Background Backdrop */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {series.backdropImage || series.posterImage ? (
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src={series.backdropImage || series.posterImage}
            alt={series.title}
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
              {series.posterImage ? (
                <img
                  src={series.posterImage}
                  alt={series.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F5F0E8]">
                  <Tv className="h-20 w-20 text-[#B8892A]/20" />
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
              {series.genre?.map((g) => (
                <span key={g} className="px-5 py-2 rounded-full bg-[#B8892A]/10 text-[#B8892A] text-[10px] font-black uppercase tracking-widest border border-[#B8892A]/20">
                  {g}
                </span>
              ))}
              <span className="px-5 py-2 rounded-full bg-[#1A1510]/5 text-[#1A1510] text-[10px] font-black uppercase tracking-widest border border-[#1A1510]/10">
                {series.type}
              </span>
              <span className="px-5 py-2 rounded-full bg-white text-[#8A7A65] text-[10px] font-black uppercase tracking-widest border border-[#E8DDD0]">
                {series.status}
              </span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-display font-black text-[#1A1510] mb-8 leading-none tracking-tighter">
              {series.title}
            </h1>

            <div className="flex flex-wrap items-center gap-10 mb-12">
              {series.rating && (
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#E8DDD0]">
                  <Star className="h-5 w-5 fill-[#B8892A] text-[#B8892A]" />
                  <span className="text-2xl font-display font-black text-[#1A1510]">
                    {series.rating.toFixed(1)}
                  </span>
                  <span className="text-xs font-black text-[#8A7A65] uppercase tracking-widest">/ 10 Score</span>
                </div>
              )}
              <div className="flex items-center gap-8 text-[#8A7A65]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-bold">{series.releaseYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4" />
                  <span className="text-sm font-bold">{series.totalSeasons} Seasons</span>
                </div>
              </div>
            </div>

            <p className="text-[#3D3020] text-xl leading-relaxed mb-12 max-w-3xl opacity-80 font-medium italic">
              {series.description}
            </p>

            <div className="flex flex-wrap gap-6 mb-16">
              {currentSeason?.episodes[0]?.episodeLink && (
                <Button
                  onClick={() => dispatch(openPlayer({ url: currentSeason.episodes[0].episodeLink || '', title: series.title, type: 'video' }))}
                  className="h-16 px-12 rounded-2xl bg-[#1A1510] text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all gap-4"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Binge Now
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

        {/* Seasons & Episodes Section */}
        {series.seasons.length > 0 && (
          <div className="py-32 border-t border-[#E8DDD0]">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
              <div>
                <h2 className="text-4xl font-display font-black text-[#1A1510] mb-4 tracking-tighter uppercase">Episode Registry</h2>
                <p className="text-[#8A7A65] font-medium uppercase tracking-[0.2em] text-[10px] font-black">Browse serialized content by season</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {series.seasons.map((season) => (
                  <Button
                    key={season.seasonNumber}
                    variant="ghost"
                    onClick={() => setSelectedSeason(season.seasonNumber)}
                    className={cn(
                      "rounded-full h-11 px-8 text-[10px] font-black uppercase tracking-widest transition-all border",
                      selectedSeason === season.seasonNumber
                        ? "bg-[#1A1510] text-white border-[#1A1510] shadow-xl"
                        : "bg-white text-[#8A7A65] border-[#E8DDD0] hover:bg-[#F5F0E8] hover:text-[#1A1510]"
                    )}
                  >
                    Season {season.seasonNumber}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentSeason?.episodes.map((episode, index) => (
                <motion.div
                  key={episode._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div
                    onClick={() => {
                      if (episode.episodeLink) {
                        dispatch(openPlayer({ url: episode.episodeLink, title: `${series.title} - S${selectedSeason} E${episode.episodeNumber}`, type: 'video' }));
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E8DDD0] p-4 transition-all duration-500 hover:shadow-2xl hover:border-[#B8892A]/30">
                      <div className="relative aspect-video overflow-hidden rounded-2xl mb-6">
                        {episode.thumbnailImage ? (
                          <img src={episode.thumbnailImage} alt={episode.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#F5F0E8]">
                            <Tv className="h-8 w-8 text-[#B8892A]/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center">
                            <Play className="w-5 h-5 text-[#B8892A] fill-current" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#B8892A] mb-1">Episode {episode.episodeNumber}</p>
                        <h3 className="font-display font-bold text-lg text-[#1A1510] line-clamp-1">{episode.title || `Entry ${episode.episodeNumber}`}</h3>
                        <div className="mt-4 flex items-center justify-between text-[#8A7A65] text-[10px] font-black uppercase tracking-widest opacity-60">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {episode.duration || '24m'}
                          </div>
                          <span>Ready to Play</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {/* Casting Section */}
        <div className="py-40">
          <h2 className="text-4xl font-display font-black text-[#1A1510] mb-16 tracking-tighter">Full Ensemble Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {externalData?.credits?.cast?.slice(0, 12).map((actor: any, i: number) => (
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
                <p className="font-body font-black text-sm text-[#1A1510] text-center">{actor.name}</p>
                <p className="font-body text-[10px] font-bold text-[#8A7A65] uppercase tracking-widest text-center mt-1">as {actor.character}</p>
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
                      alt={rec.name} 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-black">View Detail</Button>
                    </div>
                  </div>
                  <h3 className="font-display font-black text-[#1A1510] truncate uppercase text-xs tracking-tight">{rec.name}</h3>
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