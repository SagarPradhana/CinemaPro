import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

export const searchAnime = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime`, {
      params: { q: query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Jikan Search Error:', error);
    return [];
  }
};

export const getAnimeDetails = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}/full`);
    return response.data.data;
  } catch (error) {
    console.error('Jikan Detail Fetch Error:', error);
    return null;
  }
};

export const transformJikanToAnime = (anime: any) => {
  return {
    title: anime.title,
    description: anime.synopsis,
    genre: anime.genres?.map((g: any) => g.name) || [],
    releaseYear: anime.aired?.from ? new Date(anime.aired.from).getFullYear() : undefined,
    rating: anime.score,
    posterImage: anime.images?.jpg?.large_image_url,
    backdropImage: anime.images?.jpg?.large_image_url,
    movieLink: anime.url,
    isLatest: true,
    malId: anime.mal_id,
    episodes: anime.episodes,
    status: anime.status,
  };
};
