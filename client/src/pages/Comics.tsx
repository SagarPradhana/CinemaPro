import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import ContentCard, { ContentCardSkeleton } from '@/components/ContentCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchComics } from '@/store/comicsSlice';
import { debounce } from '@/lib/utils';

const genres = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Slice of Life'];
const types = [
  { value: 'all', label: 'All' },
  { value: 'comic', label: 'Comics' },
  { value: 'manga', label: 'Manga' },
  { value: 'manhwa', label: 'Manhwa' },
];

export default function Comics() {
  const dispatch = useAppDispatch();
  const { items, loading, pagination } = useAppSelector((state) => state.comics);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pages || 1;
  const selectedGenre = searchParams.get('genre') || 'All';
  const selectedType = searchParams.get('type') || 'all';

  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedGenre !== 'All') params.genre = selectedGenre;
    if (selectedType !== 'all') params.type = selectedType;
    if (search) params.search = search;
    params.page = searchParams.get('page') || '1';
    dispatch(fetchComics(params));
  }, [dispatch, selectedGenre, selectedType, search, searchParams.get('page')]);

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    const newParams: Record<string, string> = {};
    if (value) newParams.search = value;
    if (selectedGenre !== 'All') newParams.genre = selectedGenre;
    if (selectedType !== 'all') newParams.type = selectedType;
    setSearchParams(newParams);
  }, 300);

  const handleTypeChange = (type: string) => {
    const newParams: Record<string, string> = {};
    if (selectedGenre !== 'All') newParams.genre = selectedGenre;
    if (search) newParams.search = search;
    if (type !== 'all') newParams.type = type;
    setSearchParams(newParams);
  };

  const handleGenreClick = (genre: string) => {
    const newParams: Record<string, string> = {};
    if (genre !== 'All') newParams.genre = genre;
    if (selectedType !== 'all') newParams.type = selectedType;
    if (search) newParams.search = search;
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => setSearchParams({ ...Object.fromEntries(searchParams), page: page.toString() });

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#B8892A]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-[#B8892A]/10 flex items-center justify-center shadow-sm">
              <BookOpen className="h-8 w-8 text-[#B8892A]" />
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-display font-black text-[#1A1510] tracking-tighter uppercase leading-none">Script Library</h1>
              <p className="text-[#8A7A65] font-medium mt-2 tracking-[0.1em] uppercase text-[11px] font-black">Read comics, manga, and manhwa</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-20 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {types.map((type) => (
              <Button
                key={type.value}
                variant="ghost"
                size="sm"
                onClick={() => handleTypeChange(type.value)}
                className={cn(
                  "rounded-full px-8 h-11 text-[10px] font-black uppercase tracking-widest transition-all border",
                  selectedType === type.value 
                    ? "bg-[#1A1510] text-white border-[#1A1510] shadow-xl" 
                    : "bg-white text-[#8A7A65] border-[#E8DDD0] hover:text-[#1A1510] hover:bg-[#F5F0E8]"
                )}
              >
                {type.label}
              </Button>
            ))}
          </div>
          <div className="w-full lg:w-96">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search series..."
                defaultValue={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-white border-[#E8DDD0] rounded-full h-14 pl-8 focus:border-[#B8892A] text-[#1A1510] shadow-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div className="mb-16 flex flex-wrap gap-4">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant="ghost"
              size="sm"
              onClick={() => handleGenreClick(genre)}
              className={cn(
                "rounded-full px-5 transition-all text-[11px] font-bold uppercase tracking-widest",
                selectedGenre === genre ? "text-[#B8892A] underline underline-offset-8" : "text-[#8A7A65] hover:text-[#1A1510]"
              )}
            >
              {genre}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => <ContentCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="py-40 text-center">
            <BookOpen className="mx-auto h-24 w-24 text-[#B8892A]/10" />
            <h3 className="mt-8 text-3xl font-display font-black text-[#1A1510]">No comics found</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
              {items.map((comic) => (
                <ContentCard key={comic._id} data={comic} type="comic" />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-32 flex justify-center items-center gap-6">
                <Button
                  variant="ghost"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="rounded-full h-12 px-8 border border-[#E8DDD0] text-[#8A7A65] font-black uppercase text-[10px] tracking-widest hover:bg-[#F5F0E8] hover:text-[#1A1510]"
                >
                  Previous
                </Button>
                <div className="flex gap-3">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      onClick={() => handlePageChange(i + 1)}
                      className={cn(
                        "w-12 h-12 rounded-full p-0 transition-all font-black",
                        currentPage === i + 1 
                          ? "bg-[#B8892A] text-white shadow-lg shadow-[#B8892A]/20" 
                          : "text-[#8A7A65] border border-transparent hover:border-[#E8DDD0]"
                      )}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="rounded-full h-12 px-8 border border-[#E8DDD0] text-[#8A7A65] font-black uppercase text-[10px] tracking-widest hover:bg-[#F5F0E8] hover:text-[#1A1510]"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}