import mongoose, { Schema, Document } from 'mongoose';

export interface IEpisode {
  _id?: any;
  episodeNumber: number;
  title?: string;
  description?: string;
  duration?: string;
  airDate?: Date;
  thumbnailImage?: string;
  episodeLink?: string;
  isWatched: boolean;
}

export interface ISeason {
  seasonNumber: number;
  title?: string;
  episodes: IEpisode[];
}

export interface ISeries extends Document {
  title: string;
  type: 'series' | 'drama' | 'anime';
  description?: string;
  genre?: string[];
  language?: string;
  releaseYear?: number;
  rating?: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  totalSeasons?: number;
  posterImage?: string;
  backdropImage?: string;
  trailerLink?: string;
  isLatest: boolean;
  isFeatured: boolean;
  tags?: string[];
  seasons: ISeason[];
  tmdbId?: number;
  tvMazeId?: number;
  malId?: number;
  createdAt: Date;
}

const EpisodeSchema = new Schema<IEpisode>({
  episodeNumber: { type: Number, required: true },
  title: { type: String },
  description: { type: String },
  duration: { type: String },
  airDate: { type: Date },
  thumbnailImage: { type: String },
  episodeLink: { type: String },
  isWatched: { type: Boolean, default: false },
});

const SeasonSchema = new Schema<ISeason>({
  seasonNumber: { type: Number, required: true },
  title: { type: String },
  episodes: [EpisodeSchema],
});

const SeriesSchema = new Schema<ISeries>({
  title: { type: String, required: true },
  type: { type: String, enum: ['series', 'drama', 'anime'], required: true },
  description: { type: String },
  genre: [{ type: String }],
  language: { type: String },
  releaseYear: { type: Number },
  rating: { type: Number, min: 0, max: 10 },
  status: { type: String, enum: ['ongoing', 'completed', 'upcoming'], default: 'ongoing' },
  totalSeasons: { type: Number },
  posterImage: { type: String },
  backdropImage: { type: String },
  trailerLink: { type: String },
  isLatest: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  seasons: [SeasonSchema],
  tmdbId: { type: Number, unique: true, sparse: true },
  tvMazeId: { type: Number, unique: true, sparse: true },
  malId: { type: Number, unique: true, sparse: true },
}, { timestamps: true });

export const Series = mongoose.model<ISeries>('Series', SeriesSchema);