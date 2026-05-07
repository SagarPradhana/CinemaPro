import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeCategory: string;
  filters: {
    genre: string | null;
    year: number | null;
    status: string | null;
  };
  toasts: { id: string; message: string; type: 'success' | 'error' | 'warning' }[];
}

const initialState: UiState = {
  activeCategory: 'all',
  filters: {
    genre: null,
    year: null,
    status: null,
  },
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: string; value: string | number | null }>) => {
      state.filters = {
        ...state.filters,
        [action.payload.key]: action.payload.value,
      };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    addToast: (state, action: PayloadAction<{ id: string; message: string; type: 'success' | 'error' | 'warning' }>) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { setActiveCategory, setFilter, clearFilters, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;