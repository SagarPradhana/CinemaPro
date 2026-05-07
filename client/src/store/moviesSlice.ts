import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie, ApiResponse, Pagination } from '../types';
import { getAdminHeaders } from '@/lib/api';

interface MoviesState {
  items: Movie[];
  featured: Movie[];
  latest: Movie[];
  selected: Movie | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: MoviesState = {
  items: [],
  featured: [],
  latest: [],
  selected: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (params: { page?: number; limit?: number; search?: string; genre?: string; isLatest?: boolean; isFeatured?: boolean } = {}) => {
    const response = await axios.get<ApiResponse<Movie[]>>('/api/v1/movies', { params });
    return response.data;
  }
);

export const fetchFeatured = createAsyncThunk('movies/fetchFeatured', async () => {
  const response = await axios.get<ApiResponse<Movie[]>>('/api/v1/movies', { params: { isFeatured: true, limit: 10 } });
  return response.data;
});

export const fetchLatestMovies = createAsyncThunk('movies/fetchLatest', async () => {
  const response = await axios.get<ApiResponse<Movie[]>>('/api/v1/movies', { params: { isLatest: true, limit: 10 } });
  return response.data;
});

export const fetchMovieById = createAsyncThunk('movies/fetchById', async (id: string) => {
  const response = await axios.get<Movie>(`/api/v1/movies/${id}`);
  return response.data;
});

export const createMovie = createAsyncThunk('movies/create', async (data: Partial<Movie>) => {
  const response = await axios.post<Movie>('/api/v1/movies', data, { headers: getAdminHeaders() });
  return response.data;
});

export const updateMovie = createAsyncThunk('movies/update', async ({ id, data }: { id: string; data: Partial<Movie> }) => {
  const response = await axios.put<Movie>(`/api/v1/movies/${id}`, data, { headers: getAdminHeaders() });
  return response.data;
});

export const deleteMovie = createAsyncThunk('movies/delete', async (id: string) => {
  await axios.delete(`/api/v1/movies/${id}`, { headers: getAdminHeaders() });
  return id;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSelectedMovie: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featured = action.payload.data;
      })
      .addCase(fetchLatestMovies.fulfilled, (state, action) => {
        state.latest = action.payload.data;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearSelectedMovie } = moviesSlice.actions;
export default moviesSlice.reducer;