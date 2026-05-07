import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Music, ApiResponse, Pagination } from '../types';
import { getAdminHeaders } from '@/lib/api';

interface MusicState {
  items: Music[];
  featured: Music[];
  latest: Music[];
  selected: Music | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: MusicState = {
  items: [],
  featured: [],
  latest: [],
  selected: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchMusic = createAsyncThunk(
  'music/fetchMusic',
  async (params: { page?: number; limit?: number; search?: string; genre?: string } = {}) => {
    const response = await axios.get<ApiResponse<Music[]>>('/api/v1/music', { params });
    return response.data;
  }
);

export const fetchLatestMusic = createAsyncThunk('music/fetchLatestMusic', async () => {
  const response = await axios.get<ApiResponse<Music[]>>('/api/v1/music', { params: { limit: 10 } }); // Assuming latest is default or add param if needed
  return response.data;
});

export const fetchMusicById = createAsyncThunk('music/fetchById', async (id: string) => {
  const response = await axios.get<Music>(`/api/v1/music/${id}`);
  return response.data;
});

export const createMusic = createAsyncThunk('music/create', async (data: Partial<Music>) => {
  const response = await axios.post<Music>('/api/v1/music', data, { headers: getAdminHeaders() });
  return response.data;
});

export const updateMusic = createAsyncThunk('music/update', async ({ id, data }: { id: string; data: Partial<Music> }) => {
  const response = await axios.put<Music>(`/api/v1/music/${id}`, data, { headers: getAdminHeaders() });
  return response.data;
});

export const deleteMusic = createAsyncThunk('music/delete', async (id: string) => {
  await axios.delete(`/api/v1/music/${id}`, { headers: getAdminHeaders() });
  return id;
});

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    clearSelectedMusic: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchMusic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch music';
      })
      .addCase(fetchLatestMusic.fulfilled, (state, action) => {
        state.latest = action.payload.data;
      })
      .addCase(fetchMusicById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(deleteMusic.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearSelectedMusic } = musicSlice.actions;
export default musicSlice.reducer;