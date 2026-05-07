export interface Movie {
  _id: string;
  title: string;
  description?: string;
  genre: string[];
  language?: string;
  releaseYear?: number;
  rating?: number;
  duration?: string;
  director?: string;
  cast?: string[];
  posterImage?: string;
  backdropImage?: string;
  movieLink?: string;
  trailerLink?: string;
  isLatest: boolean;
  isFeatured: boolean;
  views: number;
  tags?: string[];
  tmdbId?: number;
  createdAt: string;
}

export interface Music {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string[];
  language?: string;
  releaseYear?: number;
  duration?: string;
  coverImage?: string;
  musicLink?: string;
  lyrics?: string;
  isLatest: boolean;
  isFeatured: boolean;
  plays: number;
  tags?: string[];
  externalId?: string;
  createdAt: string;
}

export interface Episode {
  _id: string;
  episodeNumber: number;
  title?: string;
  description?: string;
  duration?: string;
  airDate?: string;
  thumbnailImage?: string;
  episodeLink?: string;
  isWatched: boolean;
}

export interface Season {
  _id?: string;
  seasonNumber: number;
  title?: string;
  episodes: Episode[];
}

export interface Series {
  _id: string;
  title: string;
  type: 'series' | 'drama' | 'anime';
  description?: string;
  genre?: string[];
  language?: string;
  releaseYear?: number;
  rating?: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  totalSeasons?: number;
  posterImage?: string;
  backdropImage?: string;
  trailerLink?: string;
  isLatest: boolean;
  isFeatured: boolean;
  tags?: string[];
  seasons: Season[];
  tmdbId?: number;
  createdAt: string;
}

export interface Chapter {
  _id: string;
  chapterNumber: number;
  title?: string;
  pages: string[];
  publishedDate?: string;
  readLink?: string;
  mangaDexChapterId?: string;
}

export interface Comic {
  _id: string;
  title: string;
  author?: string;
  artist?: string;
  genre?: string[];
  type: 'comic' | 'manga' | 'manhwa';
  status: 'ongoing' | 'completed';
  releaseYear?: number;
  coverImage?: string;
  description?: string;
  chapters: Chapter[];
  isLatest: boolean;
  isFeatured: boolean;
  views: number;
  tags?: string[];
  mangaDexId?: string;
  createdAt: string;
}

export interface MusicVideo {
  _id: string;
  title: string;
  artist: string;
  genre?: string[];
  releaseYear?: number;
  duration?: string;
  posterImage?: string;
  backdropImage?: string;
  videoLink: string;
  isLatest: boolean;
  isFeatured: boolean;
  views: number;
  tags?: string[];
  externalId?: string;
  createdAt: string;
}

export interface HomeData {
  movies: { featured: Movie[]; latest: Movie[] };
  music: { featured: Music[]; latest: Music[] };
  musicVideos: { featured: MusicVideo[]; latest: MusicVideo[] };
  series: { featured: Series[]; latest: Series[] };
  comics: { featured: Comic[]; latest: Comic[] };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}