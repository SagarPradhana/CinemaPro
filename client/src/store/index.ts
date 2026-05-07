import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import musicReducer from './musicSlice';
import seriesReducer from './seriesSlice';
import comicsReducer from './comicsSlice';
import searchReducer from './searchSlice';
import uiReducer from './uiSlice';
import studioReducer from './studioSlice';
import playerReducer from './playerSlice';
import musicVideoReducer from './musicVideoSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    music: musicReducer,
    musicVideos: musicVideoReducer,
    series: seriesReducer,
    comics: comicsReducer,
    search: searchReducer,
    ui: uiReducer,
    studio: studioReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;