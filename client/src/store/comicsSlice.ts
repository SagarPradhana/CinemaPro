import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Comic, ApiResponse, Pagination } from '../types';
import { getAdminHeaders } from '@/lib/api';

interface ComicsState {
  items: Comic[];
  featured: Comic[];
  latest: Comic[];
  selected: Comic | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

const initialState: ComicsState = {
  items: [],
  featured: [],
  latest: [],
  selected: null,
  loading: false,
  error: null,
  pagination: null,
};

export const fetchComics = createAsyncThunk(
  'comics/fetchComics',
  async (params: { page?: number; limit?: number; search?: string; genre?: string; type?: string } = {}) => {
    const response = await axios.get<ApiResponse<Comic[]>>('/api/v1/comics', { params });
    return response.data;
  }
);

export const fetchComicById = createAsyncThunk('comics/fetchById', async (id: string) => {
  const response = await axios.get<Comic>(`/api/v1/comics/${id}`);
  return response.data;
});

export const fetchLatestComics = createAsyncThunk('comics/fetchLatest', async () => {
  const response = await axios.get<ApiResponse<Comic[]>>('/api/v1/comics', { params: { isLatest: true, limit: 10 } });
  return response.data;
});

export const fetchFeaturedComics = createAsyncThunk('comics/fetchFeatured', async () => {
  const response = await axios.get<ApiResponse<Comic[]>>('/api/v1/comics', { params: { isFeatured: true, limit: 10 } });
  return response.data;
});

export const createComic = createAsyncThunk('comics/create', async (data: Partial<Comic>) => {
  const response = await axios.post<Comic>('/api/v1/comics', data, { headers: getAdminHeaders() });
  return response.data;
});

export const updateComic = createAsyncThunk('comics/update', async ({ id, data }: { id: string; data: Partial<Comic> }) => {
  const response = await axios.put<Comic>(`/api/v1/comics/${id}`, data, { headers: getAdminHeaders() });
  return response.data;
});

export const deleteComic = createAsyncThunk('comics/delete', async (id: string) => {
  await axios.delete(`/api/v1/comics/${id}`, { headers: getAdminHeaders() });
  return id;
});

export const addChapter = createAsyncThunk(
  'comics/addChapter',
  async ({ id, data }: { id: string; data: unknown }) => {
    const response = await axios.post<Comic>(`/api/v1/comics/${id}/chapters`, data, { headers: getAdminHeaders() });
    return response.data;
  }
);

const comicsSlice = createSlice({
  name: 'comics',
  initialState,
  reducers: {
    clearSelectedComic: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComics.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchComics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comics';
      })
      .addCase(fetchComicById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(deleteComic.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(addChapter.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(fetchLatestComics.fulfilled, (state, action) => {
        state.latest = action.payload.data;
      })
      .addCase(fetchFeaturedComics.fulfilled, (state, action) => {
        state.featured = action.payload.data;
      });
  },
});

export const { clearSelectedComic } = comicsSlice.actions;
export default comicsSlice.reducer;