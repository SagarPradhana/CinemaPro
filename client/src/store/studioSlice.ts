import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie, Music, Series, Comic, MusicVideo } from '@/types';

type StudioItem = (Movie | Music | Series | Comic | MusicVideo) & { itemType: 'movie' | 'music' | 'series' | 'comic' | 'music-video' };

interface StudioState {
  items: StudioItem[];
}

const initialState: StudioState = {
  items: JSON.parse(localStorage.getItem('myStudio') || '[]'),
};

const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {
    addToStudio: (state, action: PayloadAction<StudioItem>) => {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('myStudio', JSON.stringify(state.items));
      }
    },
    removeFromStudio: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      localStorage.setItem('myStudio', JSON.stringify(state.items));
    },
    clearStudio: (state) => {
      state.items = [];
      localStorage.removeItem('myStudio');
    },
  },
});

export const { addToStudio, removeFromStudio, clearStudio } = studioSlice.actions;
export default studioSlice.reducer;
