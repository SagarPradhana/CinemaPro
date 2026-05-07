import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Series, ApiResponse, Pagination } from '../types';
import { getAdminHeaders } from '@/lib/api';

interface SeriesState {
  items: Series[];
  featured: Series[];
  latest: Series[];
  selected: Series | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: SeriesState = {
  items: [],
  featured: [],
  latest: [],
  selected: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchSeries = createAsyncThunk(
  'series/fetchSeries',
  async (params: { page?: number; limit?: number; search?: string; genre?: string; type?: string } = {}) => {
    const response = await axios.get<ApiResponse<Series[]>>('/api/v1/series', { params });
    return response.data;
  }
);

export const fetchDramas = createAsyncThunk(
  'series/fetchDramas',
  async (params: { page?: number; limit?: number; search?: string; genre?: string } = {}) => {
    const response = await axios.get<ApiResponse<Series[]>>('/api/v1/dramas', { params });
    return response.data;
  }
);

export const fetchAnime = createAsyncThunk(
  'series/fetchAnime',
  async (params: { page?: number; limit?: number; search?: string; genre?: string } = {}) => {
    const response = await axios.get<ApiResponse<Series[]>>('/api/v1/anime', { params });
    return response.data;
  }
);

export const fetchLatestSeries = createAsyncThunk('series/fetchLatest', async () => {
  const response = await axios.get<ApiResponse<Series[]>>('/api/v1/series', { params: { isLatest: true, limit: 10 } });
  return response.data;
});

export const fetchSeriesById = createAsyncThunk('series/fetchById', async (id: string) => {
  const response = await axios.get<Series>(`/api/v1/series/${id}`);
  return response.data;
});

export const createSeries = createAsyncThunk('series/create', async (data: Partial<Series>) => {
  const response = await axios.post<Series>('/api/v1/series', data, { headers: getAdminHeaders() });
  return response.data;
});

export const updateSeries = createAsyncThunk('series/update', async ({ id, data }: { id: string; data: Partial<Series> }) => {
  const response = await axios.put<Series>(`/api/v1/series/${id}`, data, { headers: getAdminHeaders() });
  return response.data;
});

export const deleteSeries = createAsyncThunk('series/delete', async (id: string) => {
  await axios.delete(`/api/v1/series/${id}`, { headers: getAdminHeaders() });
  return id;
});

export const addEpisode = createAsyncThunk(
  'series/addEpisode',
  async ({ id, seasonNumber, data }: { id: string; seasonNumber: number; data: unknown }) => {
    const response = await axios.post<Series>(`/api/v1/series/${id}/seasons/${seasonNumber}/episodes`, data, { headers: getAdminHeaders() });
    return response.data;
  }
);

const seriesSlice = createSlice({
  name: 'series',
  initialState,
  reducers: {
    clearSelectedSeries: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch series';
      })
      .addCase(fetchDramas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDramas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchDramas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dramas';
      })
      .addCase(fetchAnime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch anime';
      })
      .addCase(fetchLatestSeries.fulfilled, (state, action) => {
        state.latest = action.payload.data;
      })
      .addCase(fetchSeriesById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(deleteSeries.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(addEpisode.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export const { clearSelectedSeries } = seriesSlice.actions;
export default seriesSlice.reducer;