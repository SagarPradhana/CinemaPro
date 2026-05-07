import axios from 'axios';

const BASE_URL = 'https://api.tvmaze.com';

export const searchTVShows = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/shows`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('TVMaze Search Error:', error);
    return [];
  }
};

export const getShowDetails = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/shows/${id}`, {
      params: { embed: 'cast' },
    });
    return response.data;
  } catch (error) {
    console.error('TVMaze Detail Fetch Error:', error);
    return null;
  }
};

export const transformTVMazeToSeries = (data: any) => {
  const show = data.show || data;
  return {
    title: show.name,
    description: show.summary?.replace(/<[^>]*>?/gm, ''), // Remove HTML tags
    genre: show.genres || [],
    language: show.language,
    releaseYear: show.premiered ? new Date(show.premiered).getFullYear() : undefined,
    rating: show.rating?.average,
    posterImage: show.image?.original || show.image?.medium,
    backdropImage: show.image?.original,
    movieLink: show.officialSite || '',
    isLatest: true,
    tvMazeId: show.id,
  };
};
