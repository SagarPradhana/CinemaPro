import axios from 'axios';

// Piped has multiple instances, using a common one
const BASE_URL = 'https://pipedapi.kavin.rocks';

export const searchVideos = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { q: query, filter: 'videos' },
    });
    return response.data.items;
  } catch (error) {
    console.error('Piped Search Error:', error);
    return [];
  }
};

export const getVideoDetails = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/streams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Piped Detail Fetch Error:', error);
    return null;
  }
};

export const transformPipedToMusicVideo = (video: any) => {
  // Piped IDs are usually the YouTube video ID
  const videoId = video.url?.split('v=')[1] || video.id;
  
  return {
    title: video.title,
    artist: video.uploaderName,
    views: video.views,
    duration: video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:00',
    posterImage: video.thumbnail,
    movieLink: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '',
    isLatest: true,
    pipedId: videoId,
  };
};
