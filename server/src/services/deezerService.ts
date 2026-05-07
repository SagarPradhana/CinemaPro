import axios from 'axios';

const BASE_URL = 'https://api.deezer.com';

export const searchMusic = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { q: query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Deezer Search Error:', error);
    return [];
  }
};

export const getTrackDetails = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/track/${id}`);
    return response.data;
  } catch (error) {
    console.error('Deezer Track Fetch Error:', error);
    return null;
  }
};

export const transformDeezerToMusic = (track: any) => {
  return {
    title: track.title,
    artist: track.artist?.name,
    album: track.album?.title,
    duration: `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
    coverImage: track.album?.cover_xl || track.album?.cover_medium,
    musicLink: track.preview, // Using preview as music link for now
    releaseYear: track.release_date ? new Date(track.release_date).getFullYear() : undefined,
    deezerId: track.id,
    isLatest: true,
  };
};
