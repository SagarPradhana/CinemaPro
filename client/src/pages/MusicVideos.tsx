import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';
import ContentCard, { ContentCardSkeleton } from '@/components/ContentCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchMusicVideos } from '@/store/musicVideoSlice';
import { debounce } from '@/lib/utils';

const genres = ['All', 'Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'];

export default function MusicVideos() {
  const dispatch = useAppDispatch();
  const { items, loading, pagination } = useAppSelector((state) => state.musicVideos);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pages || 1;
  const selectedGenre = searchParams.get('genre') || 'All';

  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedGenre !== 'All') params.genre = selectedGenre;
    if (search) params.search = search;
    params.page = searchParams.get('page') || '1';
    dispatch(fetchMusicVideos(params));
  }, [dispatch, selectedGenre, search, searchParams.get('page')]);

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    if (value) {
      setSearchParams({ search: value, genre: selectedGenre });
    } else {
      setSearchParams({ genre: selectedGenre });
    }
  }, 300);

  const handleGenreClick = (genre: string) => {
    if (genre === 'All') {
      setSearchParams(search ? { search } : {});
    } else {
      setSearchParams({ genre, ...(search ? { search } : {}) });
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ ...Object.fromEntries(searchParams), page: page.toString() });
  };

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
              <Tv className="h-8 w-8 text-[#B8892A]" />
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-display font-black text-[#1A1510] tracking-tighter uppercase leading-none">Visual Symphonies</h1>
              <p className="text-[#8A7A65] font-medium mt-2 tracking-[0.1em] uppercase text-[11px] font-black">Cinematic music videos and performance art</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-20 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant="ghost"
                size="sm"
                onClick={() => handleGenreClick(genre)}
                className={cn(
                  "rounded-full px-8 h-11 text-[10px] font-black uppercase tracking-widest transition-all border",
                  selectedGenre === genre
                    ? "bg-[#1A1510] text-white border-[#1A1510] shadow-xl"
                    : "bg-white text-[#8A7A65] border-[#E8DDD0] hover:text-[#1A1510] hover:bg-[#F5F0E8]"
                )}
              >
                {genre}
              </Button>
            ))}
          </div>
          <div className="w-full lg:w-96">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search videos..."
                defaultValue={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-white border-[#E8DDD0] rounded-full h-14 pl-8 focus:border-[#B8892A] text-[#1A1510] shadow-sm font-medium"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-10">
            {[...Array(12)].map((_, i) => <ContentCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="py-40 text-center">
            <Tv className="mx-auto h-24 w-24 text-[#B8892A]/10" />
            <h3 className="mt-8 text-3xl font-display font-black text-[#1A1510]">No visuals found</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-10">
              {items.map((video) => (
                <ContentCard key={video._id} data={video} type="music-video" />
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
