import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import ContentCard from '@/components/ContentCard';
import { Input } from '@/components/ui/input';
import MusicCard from '@/components/MusicCard';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { searchAll, setSearchQuery } from '@/store/searchSlice';
import { debounce } from '@/lib/utils';

const categories = [
  { key: 'all', label: 'All Content' },
  { key: 'movie', label: 'Movies' },
  { key: 'music', label: 'Music' },
  { key: 'series', label: 'Series' },
  { key: 'drama', label: 'Dramas' },
  { key: 'anime', label: 'Anime' },
  { key: 'comic', label: 'Comics' },
];

export default function Search() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { results, loading } = useAppSelector((state) => state.search);

  useEffect(() => {
    if (query) {
      dispatch(setSearchQuery(query));
      dispatch(searchAll({ q: query, category: selectedCategory === 'all' ? undefined : selectedCategory }));
    }
  }, [dispatch, query, selectedCategory]);

  const handleSearch = debounce((value: string) => {
    setSearchInput(value);
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    }
  }, 300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const getResultsCount = () => {
    let total = 0;
    if (selectedCategory === 'all' || selectedCategory === 'movie') total += results.movies.length;
    if (selectedCategory === 'all' || selectedCategory === 'music') total += results.music.length;
    if (selectedCategory === 'all' || selectedCategory === 'series') total += results.series.length;
    if (selectedCategory === 'all' || selectedCategory === 'drama') total += results.dramas.length;
    if (selectedCategory === 'all' || selectedCategory === 'anime') total += results.anime.length;
    if (selectedCategory === 'all' || selectedCategory === 'comic') total += results.comics.length;
    return total;
  };

  const renderResults = (type: 'movie' | 'music' | 'series' | 'drama' | 'anime' | 'comic', items: unknown[]) => {
    if (!items.length) return null;
    return (
      <div className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#E8DDD0]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8892A]">
            {type === 'movie' ? 'Cinematic Features' : type === 'music' ? 'Aural Library' : type === 'series' ? 'Binge Hub' : type === 'drama' ? 'Drama Theatre' : type === 'anime' ? 'Anime World' : 'Script Library'}
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#E8DDD0]" />
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
          {items.map((item: any) => (
            type === 'music' ? (
              <MusicCard key={item._id} data={item} />
            ) : (
              <ContentCard key={item._id} data={item} type={type} />
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#B8892A]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-20 rounded-[32px] bg-[#B8892A]/10 flex items-center justify-center shadow-sm mb-8">
              <SearchIcon className="h-8 w-8 text-[#B8892A]" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-display font-black text-[#1A1510] uppercase tracking-tighter leading-none mb-6">Archive</h1>
            <p className="text-[#8A7A65] font-medium uppercase tracking-[0.2em] text-[11px] font-black">Explore the entire Cinema Pro collection</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <Input
                type="search"
                placeholder="Search for movies, music, series..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-20 bg-white border-[#E8DDD0] rounded-full pl-16 pr-8 text-xl text-[#1A1510] focus:border-[#B8892A] shadow-2xl shadow-[#B8892A]/5 transition-all"
              />
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-[#8A7A65] transition-colors group-focus-within:text-[#B8892A]" />
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={cn(
                  "rounded-full px-8 h-11 text-[10px] font-black uppercase tracking-widest transition-all border",
                  selectedCategory === cat.key 
                    ? "bg-[#1A1510] text-white border-[#1A1510] shadow-xl" 
                    : "bg-white text-[#8A7A65] border-[#E8DDD0] hover:text-[#1A1510] hover:bg-[#F5F0E8]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {loading ? (
          <div className="flex justify-center py-40">
            <LoadingSpinner />
          </div>
        ) : !query ? (
          <div className="py-40 text-center">
            <div className="opacity-10 mb-8">
               <SearchIcon className="mx-auto h-32 w-32 text-[#B8892A]" />
            </div>
            <h3 className="text-3xl font-display font-black text-[#1A1510]">Begin your journey</h3>
            <p className="text-[#8A7A65] mt-4 uppercase tracking-[0.1em] text-xs font-black">Enter a keyword to unlock the gallery</p>
          </div>
        ) : (
          <div>
            <div className="mb-20 flex items-center justify-between">
               <p className="text-[#8A7A65] font-medium uppercase tracking-[0.1em] text-xs font-black">
                 Analysis found <span className="text-[#1A1510]">{getResultsCount()} matches</span>
               </p>
               <div className="h-[1px] flex-1 mx-10 bg-[#E8DDD0] opacity-30" />
               <p className="text-[#8A7A65] font-medium uppercase tracking-[0.1em] text-xs font-black">
                 Query: <span className="text-[#B8892A]">"{query}"</span>
               </p>
            </div>
            
            {(selectedCategory === 'all' || selectedCategory === 'movie') && renderResults('movie', results.movies)}
            {(selectedCategory === 'all' || selectedCategory === 'music') && renderResults('music', results.music)}
            {(selectedCategory === 'all' || selectedCategory === 'series') && renderResults('series', results.series)}
            {(selectedCategory === 'all' || selectedCategory === 'drama') && renderResults('drama', results.dramas)}
            {(selectedCategory === 'all' || selectedCategory === 'anime') && renderResults('anime', results.anime)}
            {(selectedCategory === 'all' || selectedCategory === 'comic') && renderResults('comic', results.comics)}
            
            {getResultsCount() === 0 && (
              <div className="py-40 text-center">
                <SearchIcon className="mx-auto h-24 w-24 text-[#B8892A]/10 mb-8" />
                <h3 className="text-3xl font-display font-black text-[#1A1510]">No matches in archive</h3>
                <p className="text-[#8A7A65] mt-4 uppercase tracking-[0.1em] text-xs font-black">Try refining your search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}