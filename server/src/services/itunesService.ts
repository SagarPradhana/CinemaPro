import axios from 'axios';

const BASE_URL = 'https://itunes.apple.com/search';

export const fetchTrendingMusic = async (term = 'pop top hits', limit = 50) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        term,
        entity: 'song',
        limit,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('iTunes Music Fetch Error:', error);
    return [];
  }
};

export const transformITunesToMusic = (track: any) => {
  return {
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    genre: [track.primaryGenreName],
    releaseYear: track.releaseDate ? new Date(track.releaseDate).getFullYear() : undefined,
    coverImage: track.artworkUrl100?.replace('100x100bb', '600x600bb'), // Get high-res cover
    musicLink: track.previewUrl, // 30-second preview stream URL
    externalId: track.trackId.toString(),
    isLatest: true,
  };
};

export const searchMusic = async (query: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { term: query, entity: 'song', limit: 20 },
    });
    return response.data.results;
  } catch (error) {
    console.error('iTunes Search Error:', error);
    return [];
  }
};

export const fetchTrendingMusicVideos = async (term = 'pop music video', limit = 50) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        term,
        entity: 'musicVideo',
        limit,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('iTunes Video Fetch Error:', error);
    return [];
  }
};

export const transformITunesToMusicVideo = (track: any) => {
  return {
    title: track.trackName,
    artist: track.artistName,
    description: track.collectionName || track.trackName,
    genre: [track.primaryGenreName],
    releaseYear: track.releaseDate ? new Date(track.releaseDate).getFullYear() : undefined,
    posterImage: track.artworkUrl100?.replace('100x100bb', '600x600bb'),
    backdropImage: track.artworkUrl100?.replace('100x100bb', '1200x600bb'),
    videoLink: track.previewUrl,
    externalId: track.trackId.toString(),
    isLatest: true,
  };
};
