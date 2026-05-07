import axios from 'axios';
import { getAdminHeaders } from '@/lib/api';

const demoMovies = [
  {
    title: "Interstellar",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    description: "When Earth becomes uninhabitable, a team of explorers undertakes the most important mission in human history: traveling beyond this galaxy to discover whether mankind has a future among the stars.",
    posterImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    backdropImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
    movieLink: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    isLatest: true,
    isFeatured: true,
    releaseYear: 2014,
    duration: "2h 49m",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    rating: 8.7
  },
  {
    title: "The Dark Knight",
    genre: ["Action", "Crime", "Drama"],
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterImage: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
    backdropImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=2000",
    movieLink: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    isLatest: false,
    isFeatured: true,
    releaseYear: 2008,
    duration: "2h 32m",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    rating: 9.0
  }
];

const demoMusic = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: ["Synthwave", "Pop"],
    description: "A nostalgic synth-pop masterpiece that dominated the global charts.",
    posterImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800",
    musicLink: "https://www.youtube.com/watch?v=4NRXx6U8ABQ",
    isLatest: true,
    isFeatured: true,
    releaseYear: 2020,
    duration: "3:20",
    rating: 4.9
  }
];

const demoSeries = [
  {
    title: "The Bear",
    type: "series",
    genre: ["Drama", "Comedy"],
    description: "A young chef from the fine dining world comes home to Chicago to run his family sandwich shop.",
    posterImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
    backdropImage: "https://images.unsplash.com/photo-1550966841-3ee5ad6070d8?auto=format&fit=crop&q=80&w=2000",
    movieLink: "https://www.youtube.com/watch?v=y-c1aPzrqp4",
    isLatest: true,
    isFeatured: true,
    releaseYear: 2022,
    duration: "30m/ep",
    rating: 8.6
  }
];

const demoComics = [
  {
    title: "Solo Leveling",
    type: "manhwa",
    genre: ["Action", "Fantasy"],
    description: "In a world where hunters must battle deadly monsters to protect mankind, Sung Jinwoo, a notoriously weak hunter, finds himself in a struggle for survival.",
    coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800",
    mangaDexId: "32d76d19-8a05-4d42-8c9a-db474ca683c1",
    isLatest: true,
    isFeatured: true,
    releaseYear: 2018,
    status: "Completed",
    author: "Chugong",
    views: "1.2M",
    chapters: []
  }
];

const demoMusicVideos = [
  {
    title: "Spotify Pop Hits 2026",
    artist: "Global Hits",
    genre: ["Pop", "Electronic"],
    description: "A cinematic compilation of the greatest pop hits, featuring Bruno Mars, Taylor Swift, and Alan Walker.",
    posterImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    backdropImage: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=2000",
    videoLink: "https://www.youtube.com/watch?v=XW0VHMORMw4",
    isLatest: true,
    isFeatured: true,
    releaseYear: 2024,
    duration: "4:15",
    rating: 4.8
  }
];

export const seedDemoData = async () => {
  const headers = getAdminHeaders();
  
  try {
    // Seed Movies
    for (const movie of demoMovies) {
      await axios.post('/api/v1/movies', movie, { headers });
    }
    
    // Seed Music
    for (const music of demoMusic) {
      await axios.post('/api/v1/music', music, { headers });
    }
    
    // Seed Series
    for (const series of demoSeries) {
      await axios.post('/api/v1/series', series, { headers });
    }
    
    // Seed Comics
    for (const comic of demoComics) {
      await axios.post('/api/v1/comics', comic, { headers });
    }

    // Seed Music Videos
    for (const mv of demoMusicVideos) {
      await axios.post('/api/v1/music-videos', mv, { headers });
    }
    
    return true;
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
};
