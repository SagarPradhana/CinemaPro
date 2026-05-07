import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AppDispatch, RootState } from '@/store';
import { fetchFeatured, fetchLatestMovies } from '@/store/moviesSlice';
import { fetchLatestComics } from '@/store/comicsSlice';
import { fetchLatestMusic } from '@/store/musicSlice';
import { fetchLatestMusicVideos } from '@/store/musicVideoSlice';
import { fetchLatestSeries } from '@/store/seriesSlice';
import HeroSection from '@/components/HeroSection';
import SectionRow from '@/components/SectionRow';
import ContentCard, { ContentCardSkeleton } from '@/components/ContentCard';
import MusicCard from '@/components/MusicCard';
import StatsBanner from '@/components/StatsBanner';
import ParallaxBanner from '@/components/ParallaxBanner';
import ParallaxScroll from '@/components/ParallaxScroll';

// Assets
import parallax1 from '@/assets/parallax-1.png';
import parallax2 from '@/assets/parallax-2.png';

const FADE_UP_ANIMATION = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

const BENTO_ITEMS = [
  { id: 1, title: 'Epic Action', genre: 'Adventure', emoji: '🔥', color: 'from-[#EEE9FF]', glow: 'bg-[#5B3FD4]' },
  { id: 2, title: 'Romance', genre: 'Drama', emoji: '💖', color: 'from-[#FDE8EF]', glow: 'bg-[#C94070]' },
  { id: 3, title: 'Sci-Fi', genre: 'Futuristic', emoji: '🚀', color: 'from-[#FDF3DC]', glow: 'bg-[#B8892A]' },
  { id: 4, title: 'Horror', genre: 'Thriller', emoji: '👻', color: 'from-red-100', glow: 'bg-red-500' },
  { id: 5, title: 'Comedy', genre: 'Funny', emoji: '😂', color: 'from-yellow-50', glow: 'bg-yellow-400' },
];

const GENRES = [
  { label: 'Action', emoji: '⚔️', color: 'bg-[#EEE9FF] border-[#5B3FD4]/20 text-[#5B3FD4]' },
  { label: 'Romance', emoji: '💌', color: 'bg-[#FDE8EF] border-[#C94070]/20 text-[#C94070]' },
  { label: 'Sci-Fi', emoji: '🛸', color: 'bg-[#FDF3DC] border-[#B8892A]/20 text-[#B8892A]' },
  { label: 'Comedy', emoji: '🎭', color: 'bg-green-50 border-green-200 text-green-600' },
  { label: 'Horror', emoji: '🧛', color: 'bg-blue-50 border-blue-200 text-blue-600' },
  { label: 'Drama', emoji: '🎬', color: 'bg-purple-50 border-purple-200 text-purple-600' },
];

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { featured, latest: latestMovies, loading: moviesLoading } = useSelector((state: RootState) => state.movies);
  const { latest: latestMusic, loading: musicLoading } = useSelector((state: RootState) => state.music);
  const { latest: latestMusicVideos, loading: videoLoading } = useSelector((state: RootState) => state.musicVideos);
  const { latest: latestSeries, loading: seriesLoading } = useSelector((state: RootState) => state.series);
  const { latest: latestComics, loading: comicsLoading } = useSelector((state: RootState) => state.comics);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchLatestMovies());
    dispatch(fetchLatestMusic());
    dispatch(fetchLatestMusicVideos());
    dispatch(fetchLatestSeries());
    dispatch(fetchLatestComics());
  }, [dispatch]);

  const isLoading = moviesLoading || musicLoading || videoLoading || seriesLoading || comicsLoading;

  return (
    <div className="min-h-screen pb-40 relative">
      {/* Decorative Parallax Background Elements */}
      <ParallaxScroll speed={0.2} offset={100} className="absolute top-[1000px] right-[-100px] pointer-events-none z-0">
        <div className="w-96 h-96 rounded-full bg-[#B8892A]/5 blur-[120px]" />
      </ParallaxScroll>
      <ParallaxScroll speed={-0.3} offset={150} className="absolute top-[2000px] left-[-100px] pointer-events-none z-0">
        <div className="w-[500px] h-[500px] rounded-full bg-[#5B3FD4]/5 blur-[150px]" />
      </ParallaxScroll>

      {/* Hero Section */}
      <section className="relative">
        {isLoading ? (
          <div className="h-[740px] w-full bg-[#F5F0E8] animate-pulse" />
        ) : (
          <HeroSection featured={featured} />
        )}
      </section>

      {/* Ticker Bar */}
      <div className="bg-[#FDF3DC] border-y border-[#B8892A]/20 py-4 overflow-hidden relative z-10">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 mx-10">
              <span className="text-[#B8892A] font-black text-[11px] uppercase tracking-[0.3em]">
                {latestMovies[i % latestMovies.length]?.title || 'Now Streaming Masterpieces'} ✦
              </span>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        className="relative z-10"
      >
        {/* Latest Movies Row */}
        <motion.div variants={FADE_UP_ANIMATION}>
          <SectionRow title="Cinematic Masterpieces" genre="Trending Collection" items={latestMovies} viewAllLink="/movies">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {isLoading
                ? [...Array(5)].map((_, i) => <ContentCardSkeleton key={i} />)
                : latestMovies.slice(0, 5).map((movie) => <ContentCard key={movie._id} data={movie} type="movie" />)}
            </div>
          </SectionRow>
        </motion.div>

        {/* Latest Comics Row */}
        <motion.div variants={FADE_UP_ANIMATION}>
          <SectionRow title="Script Registry" genre="Latest Scripts" items={latestComics} viewAllLink="/comics">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {comicsLoading
                ? [...Array(5)].map((_, i) => <ContentCardSkeleton key={i} />)
                : latestComics.slice(0, 5).map((comic) => <ContentCard key={comic._id} data={comic} type="comic" />)}
            </div>
          </SectionRow>
        </motion.div>

        {/* First Parallax Banner */}
        <ParallaxBanner
          image={parallax1}
          title="Infinite Stories"
          subtitle="The Future of Cinema"
        />

        {/* Featured Bento Grid */}
        <motion.div variants={FADE_UP_ANIMATION} className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] grid-rows-[auto] lg:grid-rows-[220px_220px] gap-8">
            {BENTO_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-[28px] overflow-hidden group bg-white border border-[#E8DDD0] p-12 flex flex-col items-center justify-center transition-all duration-500 shadow-sm hover:shadow-xl ${i === 0 ? 'lg:row-span-2' : ''
                  } ${item.color}`}
              >
                {/* Glow Circle */}
                <div className={`absolute w-32 h-32 rounded-full ${item.glow} blur-[40px] opacity-[0.15] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000`} />

                <span className="text-9xl mb-8 relative z-10 opacity-[0.15] group-hover:opacity-[0.25] transition-all duration-1000 group-hover:scale-110">
                  {item.emoji}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-white/60 via-white/40 to-transparent z-20 backdrop-blur-[2px]">
                  <p className="text-[#B8892A] text-[10px] font-black uppercase tracking-[0.3em] mb-2">{item.genre}</p>
                  <h3 className="font-display font-black text-3xl text-[#1A1510] tracking-tighter leading-none mb-6">{item.title}</h3>
                  <div className="flex gap-3">
                    <span className="px-4 py-1.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/50 text-[9px] font-black text-[#8A7A65] uppercase tracking-widest">Premium</span>
                    <span className="px-4 py-1.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/50 text-[9px] font-black text-[#8A7A65] uppercase tracking-widest">4K UHD</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Music Row */}
        <motion.div variants={FADE_UP_ANIMATION}>
          <SectionRow title="Musical Journeys" genre="Aural Experience" items={latestMusic} viewAllLink="/music">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {isLoading
                ? [...Array(4)].map((_, i) => <div key={i} className="h-[92px] bg-[#F5F0E8] rounded-[20px] animate-pulse" />)
                : latestMusic.slice(0, 4).map((track, i) => (
                  <MusicCard key={track._id} data={track} isPlaying={i === 0} />
                ))}
            </div>
          </SectionRow>
        </motion.div>

        {/* Series Row */}
        <motion.div variants={FADE_UP_ANIMATION}>
          <SectionRow title="Serialized Masterpieces" genre="Binge Collection" items={latestSeries} viewAllLink="/series">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {isLoading
                ? [...Array(5)].map((_, i) => <ContentCardSkeleton key={i} />)
                : latestSeries.slice(0, 5).map((series) => <ContentCard key={series._id} data={series} type="series" />)}
            </div>
          </SectionRow>
        </motion.div>

        {/* Second Parallax Banner */}
        <ParallaxBanner
          image={parallax2}
          title="Pure Sound"
          subtitle="The Art of Audio"
          height="h-[500px]"
        />

        {/* Music Videos Row */}
        <motion.div variants={FADE_UP_ANIMATION}>
          <SectionRow title="Visual Symphonies" genre="Cinematic Performance" items={latestMusicVideos} viewAllLink="/music-videos">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {isLoading
                ? [...Array(5)].map((_, i) => <ContentCardSkeleton key={i} />)
                : latestMusicVideos.slice(0, 5).map((video) => <ContentCard key={video._id} data={video} type="music-video" />)}
            </div>
          </SectionRow>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={FADE_UP_ANIMATION} className="py-24">
          <StatsBanner />
        </motion.div>

        {/* Genre Pills Row */}
        <motion.div variants={FADE_UP_ANIMATION} className="container mx-auto px-6 mb-40">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {GENRES.map((genre) => (
              <motion.div
                key={genre.label}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`flex flex-col items-center justify-center p-8 rounded-[24px] border ${genre.color} transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer`}
              >
                <span className="text-4xl mb-4">{genre.emoji}</span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{genre.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}