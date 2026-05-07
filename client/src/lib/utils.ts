import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGenreColor(genre: string): string {
  const genreMap: Record<string, string> = {
    Action: 'genre-action',
    Drama: 'genre-drama',
    Comedy: 'genre-comedy',
    Horror: 'genre-horror',
    'Sci-Fi': 'genre-sci-fi',
    Romance: 'genre-romance',
    Thriller: 'genre-thriller',
    Animation: 'genre-animation',
    Adventure: 'genre-action',
    Fantasy: 'genre-drama',
    Mystery: 'genre-thriller',
    Crime: 'genre-thriller',
  };
  return genreMap[genre] || 'bg-gray-500 text-white';
}

export function getRatingStars(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating / 2);
  const half = rating % 2 >= 1;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}