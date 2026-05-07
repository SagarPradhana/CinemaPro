import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Layout from './components/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import MediaPlayer from './components/MediaPlayer';

const Home = lazy(() => import('./pages/Home'));
const Movies = lazy(() => import('./pages/Movies'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const Music = lazy(() => import('./pages/Music'));
const MusicDetail = lazy(() => import('./pages/MusicDetail'));
const MusicVideos = lazy(() => import('./pages/MusicVideos'));
const MusicVideoDetail = lazy(() => import('./pages/MusicVideoDetail'));
const Series = lazy(() => import('./pages/Series'));
const SeriesDetail = lazy(() => import('./pages/SeriesDetail'));
const Dramas = lazy(() => import('./pages/Dramas'));
const DramaDetail = lazy(() => import('./pages/DramaDetail'));
const Comics = lazy(() => import('./pages/Comics'));
const ComicDetail = lazy(() => import('./pages/ComicDetail'));
const Search = lazy(() => import('./pages/Search'));
const Studio = lazy(() => import('./pages/Studio'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="movies/:id" element={<MovieDetail />} />
          <Route path="music" element={<Music />} />
          <Route path="music/:id" element={<MusicDetail />} />
          <Route path="music-videos" element={<MusicVideos />} />
          <Route path="music-videos/:id" element={<MusicVideoDetail />} />
          <Route path="series" element={<Series />} />
          <Route path="series/:id" element={<SeriesDetail />} />
          <Route path="dramas" element={<Dramas />} />
          <Route path="dramas/:id" element={<DramaDetail />} />
          <Route path="comics" element={<Comics />} />
          <Route path="comics/:id" element={<ComicDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="studio" element={<Studio />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MediaPlayer />
      <Toaster />
    </Suspense>
  );
}

export default App;