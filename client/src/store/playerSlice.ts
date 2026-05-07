import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerItem {
  _id: string;
  url: string;
  title: string;
  type: 'video' | 'audio' | 'comic';
}

interface PlayerState {
  isOpen: boolean;
  url: string | null;
  title: string | null;
  type: 'video' | 'audio' | 'comic' | null;
  playlist: PlayerItem[];
  currentIndex: number;
}

const initialState: PlayerState = {
  isOpen: false,
  url: null,
  title: null,
  type: null,
  playlist: [],
  currentIndex: -1,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    openPlayer: (state, action: PayloadAction<{ url: string; title: string; type: 'video' | 'audio' | 'comic'; playlist?: PlayerItem[] }>) => {
      state.isOpen = true;
      state.url = action.payload.url;
      state.title = action.payload.title;
      state.type = action.payload.type;
      state.playlist = action.payload.playlist || [];
      state.currentIndex = action.payload.playlist 
        ? action.payload.playlist.findIndex(item => item.url === action.payload.url)
        : -1;
    },
    closePlayer: (state) => {
      state.isOpen = false;
      state.url = null;
      state.title = null;
      state.type = null;
      state.playlist = [];
      state.currentIndex = -1;
    },
    nextTrack: (state) => {
      if (state.playlist.length > 0 && state.currentIndex < state.playlist.length - 1) {
        state.currentIndex += 1;
        const next = state.playlist[state.currentIndex];
        state.url = next.url;
        state.title = next.title;
        state.type = next.type;
      }
    },
    prevTrack: (state) => {
      if (state.playlist.length > 0 && state.currentIndex > 0) {
        state.currentIndex -= 1;
        const prev = state.playlist[state.currentIndex];
        state.url = prev.url;
        state.title = prev.title;
        state.type = prev.type;
      }
    }
  },
});

export const { openPlayer, closePlayer, nextTrack, prevTrack } = playerSlice.actions;
export default playerSlice.reducer;
