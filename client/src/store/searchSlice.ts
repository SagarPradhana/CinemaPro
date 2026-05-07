import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie, Music, Series, Comic } from '../types';

interface SearchResults {
  movies: Movie[];
  music: Music[];
  series: Series[];
  dramas: Series[];
  anime: Series[];
  comics: Comic[];
}

interface SearchState {
  query: string;
  results: SearchResults;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: {
    movies: [],
    music: [],
    series: [],
    dramas: [],
    anime: [],
    comics: [],
  },
  loading: false,
  error: null,
};

export const searchAll = createAsyncThunk('search/searchAll', async (params: { q: string; category?: string }) => {
  const response = await axios.get<SearchResults>('/api/v1/search', { params });
  return response.data;
});

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = initialState.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      });
  },
});

export const { setSearchQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;