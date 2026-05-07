import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';
const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';

export interface MangaDexManga {
  id: string;
  attributes: {
    title: { [key: string]: string };
    description: { [key: string]: string };
    status: string;
    year: number;
    tags: any[];
  };
  relationships: any[];
}

export const fetchTrendingManga = async (params: any = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 20,
        includes: ['cover_art', 'author', 'artist'],
        contentRating: ['safe', 'suggestive'],
        order: { followedCount: 'desc' },
        ...params
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('MangaDex Fetch Error:', error);
    return [];
  }
};

export const getCoverUrl = (mangaId: string, relationships: any[]) => {
  const coverArt = relationships.find(rel => rel.type === 'cover_art');
  if (!coverArt || !coverArt.attributes) return null;
  return `${COVER_BASE_URL}/${mangaId}/${coverArt.attributes.fileName}`;
};

export const transformMangaDexToComic = (manga: any) => {
  const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];
  const description = manga.attributes.description.en || Object.values(manga.attributes.description)[0];
  const author = manga.relationships.find((rel: any) => rel.type === 'author')?.attributes?.name;
  const artist = manga.relationships.find((rel: any) => rel.type === 'artist')?.attributes?.name;
  
  return {
    title,
    description,
    author,
    artist,
    status: manga.attributes.status === 'ongoing' ? 'ongoing' : 'completed',
    releaseYear: manga.attributes.year,
    genre: manga.attributes.tags.map((tag: any) => tag.attributes.name.en),
    coverImage: getCoverUrl(manga.id, manga.relationships),
    mangaDexId: manga.id,
    type: 'manga',
    chapters: []
  };
};

export const getMangaChapters = async (mangaId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
      params: {
        limit: 100,
        translatedLanguage: ['en'],
        order: { chapter: 'desc' },
        includeExternalUrl: 0
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('MangaDex Chapters Fetch Error:', error);
    return [];
  }
};
