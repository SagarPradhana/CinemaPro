import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getGenreColor } from '@/lib/utils';
import { Movie, Series, Music } from '@/types';

interface HeroCarouselProps {
  items: (Movie | Series | Music)[];
  type: 'movie' | 'series' | 'music';
}

export default function HeroCarousel({ items, type }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const currentItem = items[currentIndex];
  const imageUrl =
    type === 'music'
      ? (currentItem as Music).coverImage
      : (currentItem as Movie | Series).backdropImage ||
        (currentItem as Movie | Series).posterImage;

  const link = `/${type}s/${currentItem._id}`;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt={currentItem.title}
              className="h-full w-full object-cover"
            />
          )}
          <div className="hero-gradient absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <div className="container mx-auto">
          <motion.div
            key={`${currentIndex}-content`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {'genre' in currentItem &&
                currentItem.genre?.slice(0, 3).map((g) => (
                  <Badge key={g} className={getGenreColor(g)}>
                    {g}
                  </Badge>
                ))}
              {currentItem.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>

            <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {currentItem.title}
            </h1>

            {'description' in currentItem && currentItem.description && (
              <p className="mb-4 text-lg text-gray-300 line-clamp-2">
                {currentItem.description}
              </p>
            )}

            <div className="mb-6 flex items-center gap-4">
              {'rating' in currentItem && currentItem.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold text-white">
                    {currentItem.rating.toFixed(1)}
                  </span>
                </div>
              )}
              {'releaseYear' in currentItem && currentItem.releaseYear && (
                <span className="text-gray-300">{currentItem.releaseYear}</span>
              )}
              {'artist' in currentItem && (
                <span className="text-gray-300">{(currentItem as Music).artist}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={link}>
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Watch Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <Plus className="h-5 w-5" />
                Add to List
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}