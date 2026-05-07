import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  description?: string;
  genre: string[];
  language?: string;
  releaseYear?: number;
  rating?: number;
  duration?: string;
  director?: string;
  cast?: string[];
  posterImage?: string;
  backdropImage?: string;
  movieLink?: string;
  trailerLink?: string;
  isLatest: boolean;
  isFeatured: boolean;
  views: number;
  tags?: string[];
  tmdbId?: number;
  tvMazeId?: number;
  createdAt: Date;
}

const MovieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  description: { type: String },
  genre: [{ type: String }],
  language: { type: String },
  releaseYear: { type: Number },
  rating: { type: Number, min: 0, max: 10 },
  duration: { type: String },
  director: { type: String },
  cast: [{ type: String }],
  posterImage: { type: String },
  backdropImage: { type: String },
  movieLink: { type: String },
  trailerLink: { type: String },
  isLatest: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
  tmdbId: { type: Number, unique: true, sparse: true },
  tvMazeId: { type: Number, unique: true, sparse: true },
}, { timestamps: true });

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);