import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'demo_key_required';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const fetchTrendingMovies = async () => {
  if (TMDB_API_KEY === 'demo_key_required') {
    console.warn('TMDB_API_KEY is missing. Please set it in .env');
    return [];
  }
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data.results;
  } catch (error) {
    console.error('TMDB Fetch Error:', error);
    return [];
  }
};

export const getMovieDetails = async (tmdbId: number) => {
  if (TMDB_API_KEY === 'demo_key_required') return null;
  try {
    const response = await axios.get(`${BASE_URL}/movie/${tmdbId}`, {
      params: { 
        api_key: TMDB_API_KEY,
        append_to_response: 'videos,credits,recommendations,similar'
      },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB Detail Fetch Error:', error);
    return null;
  }
};

export const getSeriesDetails = async (tmdbId: number) => {
  if (TMDB_API_KEY === 'demo_key_required') return null;
  try {
    const response = await axios.get(`${BASE_URL}/tv/${tmdbId}`, {
      params: { 
        api_key: TMDB_API_KEY,
        append_to_response: 'videos,credits,recommendations,similar'
      },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB Series Detail Fetch Error:', error);
    return null;
  }
};

export const transformTMDBToMovie = (tmdbMovie: any) => {
  return {
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    releaseYear: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : undefined,
    rating: tmdbMovie.vote_average,
    posterImage: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}` : undefined,
    backdropImage: tmdbMovie.backdrop_path ? `${IMAGE_BASE_URL}${tmdbMovie.backdrop_path}` : undefined,
    language: tmdbMovie.original_language,
    tmdbId: tmdbMovie.id,
    isLatest: true,
  };
};

export const searchTMDBMovies = async (query: string) => {
  if (TMDB_API_KEY === 'demo_key_required') return [];
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query },
    });
    return response.data.results;
  } catch (error) {
    console.error('TMDB Search Error:', error);
    return [];
  }
};

export const fetchTrendingSeries = async () => {
  if (TMDB_API_KEY === 'demo_key_required') return [];
  try {
    const response = await axios.get(`${BASE_URL}/trending/tv/week`, {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data.results;
  } catch (error) {
    console.error('TMDB Series Fetch Error:', error);
    return [];
  }
};

export const transformTMDBToSeries = (tmdbSeries: any) => {
  return {
    title: tmdbSeries.name,
    type: 'series',
    description: tmdbSeries.overview,
    releaseYear: tmdbSeries.first_air_date ? new Date(tmdbSeries.first_air_date).getFullYear() : undefined,
    rating: tmdbSeries.vote_average,
    posterImage: tmdbSeries.poster_path ? `${IMAGE_BASE_URL}${tmdbSeries.poster_path}` : undefined,
    backdropImage: tmdbSeries.backdrop_path ? `${IMAGE_BASE_URL}${tmdbSeries.backdrop_path}` : undefined,
    language: tmdbSeries.original_language,
    tmdbId: tmdbSeries.id,
    isLatest: true,
    seasons: [],
    status: 'ongoing',
  };
};
