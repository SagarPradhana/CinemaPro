import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainment';

const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: [String],
  language: String,
  releaseYear: Number,
  rating: Number,
  duration: String,
  director: String,
  cast: [String],
  posterImage: String,
  backdropImage: String,
  movieLink: String,
  trailerLink: String,
  isLatest: Boolean,
  isFeatured: Boolean,
  views: Number,
  tags: [String],
  createdAt: Date
});

const musicSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  genre: [String],
  language: String,
  releaseYear: Number,
  duration: String,
  coverImage: String,
  musicLink: String,
  lyrics: String,
  isLatest: Boolean,
  isFeatured: Boolean,
  plays: Number,
  tags: [String],
  createdAt: Date
});

const seriesSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  genre: [String],
  language: String,
  releaseYear: Number,
  rating: Number,
  status: String,
  totalSeasons: Number,
  posterImage: String,
  backdropImage: String,
  trailerLink: String,
  isLatest: Boolean,
  isFeatured: Boolean,
  tags: [String],
  seasons: [{
    seasonNumber: Number,
    title: String,
    episodes: [{
      episodeNumber: Number,
      title: String,
      description: String,
      duration: String,
      airDate: Date,
      thumbnailImage: String,
      episodeLink: String,
      isWatched: Boolean
    }]
  }],
  createdAt: Date
});

const comicSchema = new mongoose.Schema({
  title: String,
  author: String,
  artist: String,
  genre: [String],
  type: String,
  status: String,
  releaseYear: Number,
  coverImage: String,
  description: String,
  chapters: [{
    chapterNumber: Number,
    title: String,
    pages: [String],
    publishedDate: Date,
    readLink: String
  }],
  isLatest: Boolean,
  isFeatured: Boolean,
  views: Number,
  tags: [String],
  createdAt: Date
});

const Movie = mongoose.model('Movie', movieSchema);
const Music = mongoose.model('Music', musicSchema);
const Series = mongoose.model('Series', seriesSchema);
const Comic = mongoose.model('Comic', comicSchema);

const demoMovies = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: ["Action", "Sci-Fi", "Thriller"],
    language: "English",
    releaseYear: 2010,
    rating: 8.8,
    duration: "2h 28m",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy"],
    posterImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    backdropImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200",
    movieLink: "https://example.com/movie/inception",
    trailerLink: "https://example.com/trailer/inception",
    isFeatured: true,
    isLatest: false,
    views: 15000,
    tags: ["dream", "heist", "mind"]
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Drama", "Crime"],
    language: "English",
    releaseYear: 2008,
    rating: 9.0,
    duration: "2h 32m",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    posterImage: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400",
    backdropImage: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200",
    movieLink: "https://example.com/movie/dark-knight",
    isFeatured: true,
    isLatest: false,
    views: 20000,
    tags: ["superhero", "joker", "batman"]
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    language: "English",
    releaseYear: 2014,
    rating: 8.6,
    duration: "2h 49m",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    posterImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400",
    backdropImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200",
    movieLink: "https://example.com/movie/interstellar",
    isFeatured: true,
    isLatest: true,
    views: 12000,
    tags: ["space", "wormhole", "time"]
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    genre: ["Animation", "Action", "Adventure"],
    language: "English",
    releaseYear: 2023,
    rating: 8.6,
    duration: "2h 20m",
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"],
    posterImage: "https://images.unsplash.com/photo-1614726365723-49cfae9278b7?w=400",
    backdropImage: "https://images.unsplash.com/photo-1614726365723-49cfae9278b7?w=1200",
    movieLink: "https://example.com/movie/spiderverse",
    isLatest: true,
    isFeatured: true,
    views: 8000,
    tags: ["animation", "spiderman", "multiverse"]
  },
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    language: "English",
    releaseYear: 2024,
    rating: 8.8,
    duration: "2h 46m",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin"],
    posterImage: "https://images.unsplash.com/photo-1541362070964-ff939317a2bb?w=400",
    backdropImage: "https://images.unsplash.com/photo-1541362070964-ff939317a2bb?w=1200",
    movieLink: "https://example.com/movie/dune2",
    isLatest: true,
    isFeatured: false,
    views: 6000,
    tags: ["desert", "space", "epic"]
  },
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    genre: ["Drama", "Biography", "History"],
    language: "English",
    releaseYear: 2023,
    rating: 8.9,
    duration: "3h",
    director: "Denis Villeneuve",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    posterImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400",
    backdropImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200",
    movieLink: "https://example.com/movie/oppenheimer",
    isFeatured: true,
    isLatest: false,
    views: 10000,
    tags: ["nuclear", "history", "scientist"]
  }
];

const demoMusic = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    genre: ["Pop", "Synthwave"],
    language: "English",
    releaseYear: 2020,
    duration: "3:20",
    coverImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400",
    musicLink: "https://example.com/music/blinding-lights",
    isFeatured: true,
    isLatest: false,
    plays: 50000,
    tags: ["pop", "synthwave", "hit"]
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    genre: ["Pop"],
    language: "English",
    releaseYear: 2017,
    duration: "3:53",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    musicLink: "https://example.com/music/shape-of-you",
    isFeatured: true,
    isLatest: false,
    plays: 80000,
    tags: ["pop", "hit", "ed sheeran"]
  },
  {
    title: "Bad Guy",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep, Where Do We Go?",
    genre: ["Pop", "Alternative"],
    language: "English",
    releaseYear: 2019,
    duration: "3:14",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400",
    musicLink: "https://example.com/music/bad-guy",
    isFeatured: true,
    isLatest: false,
    plays: 45000,
    tags: ["pop", "alternative", "billie"]
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    genre: ["Pop", "Dance"],
    language: "English",
    releaseYear: 2020,
    duration: "3:23",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    musicLink: "https://example.com/music/levitating",
    isLatest: true,
    isFeatured: false,
    plays: 30000,
    tags: ["pop", "dance", "dua lipa"]
  },
  {
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    genre: ["Pop", "Rock"],
    language: "English",
    releaseYear: 2022,
    duration: "2:47",
    coverImage: "https://images.unsplash.com/photo-1598387846148-47e9a2255563?w=400",
    musicLink: "https://example.com/music/as-it-was",
    isLatest: true,
    isFeatured: false,
    plays: 25000,
    tags: ["pop", "harry styles", "hit"]
  },
  {
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    genre: ["Pop", "R&B"],
    language: "English",
    releaseYear: 2016,
    duration: "3:50",
    coverImage: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400",
    musicLink: "https://example.com/music/starboy",
    isFeatured: false,
    isLatest: true,
    plays: 35000,
    tags: ["pop", "r&b", "daft punk"]
  }
];

const demoSeries = [
  {
    title: "Stranger Things",
    type: "series",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    genre: ["Drama", "Horror", "Sci-Fi"],
    language: "English",
    releaseYear: 2016,
    rating: 8.7,
    status: "completed",
    totalSeasons: 4,
    posterImage: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400",
    backdropImage: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1200",
    trailerLink: "https://example.com/trailer/stranger-things",
    isFeatured: true,
    isLatest: false,
    tags: ["supernatural", "horror", "80s"],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "The Vanishing of Will Byers", duration: "46m", episodeLink: "https://example.com/stranger-things-s1e1" },
          { episodeNumber: 2, title: "The Weirdo on Maple Street", duration: "50m", episodeLink: "https://example.com/stranger-things-s1e2" },
          { episodeNumber: 3, title: "Holly, Jolly", duration: "52m", episodeLink: "https://example.com/stranger-things-s1e3" }
        ]
      },
      {
        seasonNumber: 2,
        title: "Season 2",
        episodes: [
          { episodeNumber: 1, title: "MADMAX", duration: "48m", episodeLink: "https://example.com/stranger-things-s2e1" },
          { episodeNumber: 2, title: "Trick or Treat, Freak", duration: "49m", episodeLink: "https://example.com/stranger-things-s2e2" }
        ]
      }
    ]
  },
  {
    title: "Breaking Bad",
    type: "series",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    genre: ["Crime", "Drama", "Thriller"],
    language: "English",
    releaseYear: 2008,
    rating: 9.5,
    status: "completed",
    totalSeasons: 5,
    posterImage: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400",
    backdropImage: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200",
    isFeatured: true,
    isLatest: false,
    tags: ["crime", "drugs", "chemistry"],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "Pilot", duration: "58m", episodeLink: "https://example.com/breaking-bad-s1e1" },
          { episodeNumber: 2, title: "Cat's in the Bag...", duration: "48m", episodeLink: "https://example.com/breaking-bad-s1e2" }
        ]
      }
    ]
  },
  {
    title: "Squid Game",
    type: "drama",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    genre: ["Drama", "Thriller", "Action"],
    language: "Korean",
    releaseYear: 2021,
    rating: 8.0,
    status: "completed",
    totalSeasons: 1,
    posterImage: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=400",
    backdropImage: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=1200",
    isFeatured: true,
    isLatest: false,
    tags: ["korean", "death games", "survival"],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "Red Light, Green Light", duration: "53m", episodeLink: "https://example.com/squid-game-s1e1" },
          { episodeNumber: 2, title: "Hell", duration: "53m", episodeLink: "https://example.com/squid-game-s1e2" }
        ]
      }
    ]
  },
  {
    title: "Alice in Borderland",
    type: "drama",
    description: "A boy who is not good at games and his friends are transported to a deserted Tokyo, where they are forced to play dangerous survival games.",
    genre: ["Drama", "Action", "Thriller"],
    language: "Japanese",
    releaseYear: 2020,
    rating: 7.7,
    status: "completed",
    totalSeasons: 3,
    posterImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
    backdropImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200",
    isFeatured: true,
    isLatest: true,
    tags: ["japanese", "games", "survival"],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "GAME START", duration: "48m", episodeLink: "https://example.com/aib-s1e1" },
          { episodeNumber: 2, title: "EASY", duration: "47m", episodeLink: "https://example.com/aib-s1e2" }
        ]
      }
    ]
  },
  {
    title: "Attack on Titan",
    type: "anime",
    description: "Humanity lives inside cities surrounded by enormous walls due to the Titans, giant humanoid creatures who devour humans seemingly without reason.",
    genre: ["Animation", "Action", "Drama"],
    language: "Japanese",
    releaseYear: 2013,
    rating: 9.0,
    status: "completed",
    totalSeasons: 4,
    posterImage: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400",
    backdropImage: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1200",
    isFeatured: true,
    isLatest: false,
    tags: ["anime", "titans", "action"],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "To You, in 2000 Years", duration: "24m", episodeLink: "https://example.com/aot-s1e1" },
          { episodeNumber: 2, title: "That Day", duration: "24m", episodeLink: "https://example.com/aot-s1e2" }
        ]
      }
    ]
  },
  {
    title: "Demon Slayer",
    type: "anime",
    description: "A kindhearted boy becomes a demon slayer after his family is slaughtered and his sister turned into a demon.",
    genre: ["Animation", "Action", "Fantasy"],
    language: "Japanese",
    releaseYear: 2019,
    rating: 8.7,
    status: "completed",
    totalSeasons: 3,
    posterImage: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400",
    backdropImage: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=1200",
    isFeatured: true,
    isLatest: true,
    tags: ["anime", "demons", "samurai"],
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "Cruelty", duration: "23m", episodeLink: "https://example.com/ds-s1e1" },
          { episodeNumber: 2, title: "Instructor Muichiro", duration: "23m", episodeLink: "https://example.com/ds-s1e2" }
        ]
      }
    ]
  }
];

const demoComics = [
  {
    title: "One Piece",
    author: "Eiichiro Oda",
    artist: "Eiichiro Oda",
    genre: ["Adventure", "Action", "Comedy"],
    type: "manga",
    status: "ongoing",
    releaseYear: 1997,
    coverImage: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?w=400",
    description: "Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever, known as the One Piece.",
    isFeatured: true,
    isLatest: false,
    views: 50000,
    tags: ["manga", "pirates", "adventure"],
    chapters: [
      { chapterNumber: 1, title: "Romance Dawn - The Dawn of Adventure", pages: ["page1", "page2"], publishedDate: new Date("1997-07-22") },
      { chapterNumber: 2, title: "They Call Him Luffy", pages: ["page1", "page2"], publishedDate: new Date("1997-07-29") },
      { chapterNumber: 3, title: "Don't Get Fooled Again", pages: ["page1", "page2"], publishedDate: new Date("1997-08-05") }
    ]
  },
  {
    title: "Naruto",
    author: "Masashi Kishimoto",
    artist: "Masashi Kishimoto",
    genre: ["Action", "Adventure", "Drama"],
    type: "manga",
    status: "completed",
    releaseYear: 1999,
    coverImage: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400",
    description: "A young ninja with a demon fox sealed inside him seeks to become the greatest Hokage.",
    isFeatured: true,
    isLatest: false,
    views: 45000,
    tags: ["manga", "ninja", "action"],
    chapters: [
      { chapterNumber: 1, title: "Uzumaki Naruto", pages: ["page1", "page2"], publishedDate: new Date("1999-09-21") },
      { chapterNumber: 2, title: "The Oracle", pages: ["page1", "page2"], publishedDate: new Date("1999-09-28") }
    ]
  },
  {
    title: "Solo Leveling",
    author: "Chugong",
    artist: "DUBU (Redice Studio)",
    genre: ["Action", "Adventure", "Fantasy"],
    type: "manhwa",
    status: "completed",
    releaseYear: 2018,
    coverImage: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400",
    description: "In a world where hunters with magical abilities must battle monsters, one hunter becomes the only one who can level up.",
    isFeatured: true,
    isLatest: true,
    views: 35000,
    tags: ["manhwa", "leveling", "fantasy"],
    chapters: [
      { chapterNumber: 1, title: "I'm the Only One Who Can Level Up", pages: ["page1", "page2"], publishedDate: new Date("2018-03-25") },
      { chapterNumber: 2, title: "Hunter", pages: ["page1", "page2"], publishedDate: new Date("2018-04-01") }
    ]
  },
  {
    title: "The Beginning After The End",
    author: "TurtleMe",
    artist: "Fuyuki23",
    genre: ["Action", "Adventure", "Fantasy"],
    type: "manhwa",
    status: "ongoing",
    releaseYear: 2020,
    coverImage: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=400",
    description: "A former king is reincarnated into a world of magic where he must navigate a new life as a magic user.",
    isFeatured: true,
    isLatest: true,
    views: 25000,
    tags: ["manhwa", "reincarnation", "magic"],
    chapters: [
      { chapterNumber: 1, title: "Rebirth", pages: ["page1", "page2"], publishedDate: new Date("2020-03-30") },
      { chapterNumber: 2, title: "School", pages: ["page1", "page2"], publishedDate: new Date("2020-04-06") }
    ]
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    author: "Brian K. Vaughan",
    artist: "Sara Pichelli",
    genre: ["Action", "Adventure", "Superhero"],
    type: "comic",
    status: "completed",
    releaseYear: 2018,
    coverImage: "https://images.unsplash.com/photo-1608889825103-eb5ed7fc6615?w=400",
    description: "Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals.",
    isFeatured: false,
    isLatest: true,
    views: 15000,
    tags: ["comic", "spiderman", "superhero"],
    chapters: [
      { chapterNumber: 1, title: "Miles Morales", pages: ["page1", "page2"], publishedDate: new Date("2018-04-01") }
    ]
  },
  {
    title: "Batman: The Killing Joke",
    author: "Alan Moore",
    artist: "Brian Bolland",
    genre: ["Crime", "Superhero", "Thriller"],
    type: "comic",
    status: "completed",
    releaseYear: 1988,
    coverImage: "https://images.unsplash.com/photo-1627856013091-fed64abbdd3a?w=400",
    description: "Batman must confront the Joker and discover the dark truth about his past.",
    isFeatured: false,
    isLatest: false,
    views: 20000,
    tags: ["comic", "batman", "joker"],
    chapters: [
      { chapterNumber: 1, title: "The Killing Joke", pages: ["page1", "page2", "page3"], publishedDate: new Date("1988-03-01") }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Movie.deleteMany({});
    await Music.deleteMany({});
    await Series.deleteMany({});
    await Comic.deleteMany({});
    console.log('Cleared existing data');

    await Movie.insertMany(demoMovies);
    console.log(`Inserted ${demoMovies.length} movies`);

    await Music.insertMany(demoMusic);
    console.log(`Inserted ${demoMusic.length} music tracks`);

    await Series.insertMany(demoSeries);
    console.log(`Inserted ${demoSeries.length} series/dramas/anime`);

    await Comic.insertMany(demoComics);
    console.log(`Inserted ${demoComics.length} comics/manga`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();