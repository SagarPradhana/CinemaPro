import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MusicVideo, ApiResponse, Pagination } from '../types';
import { getAdminHeaders } from '@/lib/api';

interface MusicVideosState {
  items: MusicVideo[];
  featured: MusicVideo[];
  latest: MusicVideo[];
  selected: MusicVideo | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: MusicVideosState = {
  items: [],
  featured: [],
  latest: [],
  selected: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchMusicVideos = createAsyncThunk(
  'musicVideos/fetchMusicVideos',
  async (params: { page?: number; limit?: number; search?: string; genre?: string; isLatest?: boolean; isFeatured?: boolean } = {}) => {
    const response = await axios.get<ApiResponse<MusicVideo[]>>('/api/v1/music-videos', { params });
    return response.data;
  }
);

export const fetchFeaturedMusicVideos = createAsyncThunk('musicVideos/fetchFeatured', async () => {
  const response = await axios.get<ApiResponse<MusicVideo[]>>('/api/v1/music-videos', { params: { isFeatured: true, limit: 10 } });
  return response.data;
});

export const fetchLatestMusicVideos = createAsyncThunk('musicVideos/fetchLatest', async () => {
  const response = await axios.get<ApiResponse<MusicVideo[]>>('/api/v1/music-videos', { params: { isLatest: true, limit: 10 } });
  return response.data;
});

export const fetchMusicVideoById = createAsyncThunk('musicVideos/fetchById', async (id: string) => {
  const response = await axios.get<MusicVideo>(`/api/v1/music-videos/${id}`);
  return response.data;
});

export const deleteMusicVideo = createAsyncThunk('musicVideos/delete', async (id: string) => {
  await axios.delete(`/api/v1/music-videos/${id}`, { headers: getAdminHeaders() });
  return id;
});

const musicVideosSlice = createSlice({
  name: 'musicVideos',
  initialState,
  reducers: {
    clearSelectedMusicVideo: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusicVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMusicVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchMusicVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch music videos';
      })
      .addCase(fetchFeaturedMusicVideos.fulfilled, (state, action) => {
        state.featured = action.payload.data;
      })
      .addCase(fetchLatestMusicVideos.fulfilled, (state, action) => {
        state.latest = action.payload.data;
      })
      .addCase(fetchMusicVideoById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(deleteMusicVideo.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearSelectedMusicVideo } = musicVideosSlice.actions;
export default musicVideosSlice.reducer;
