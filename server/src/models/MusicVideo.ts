import mongoose, { Schema, Document } from 'mongoose';

export interface IMusicVideo extends Document {
  title: string;
  artist: string;
  description?: string;
  genre: string[];
  releaseYear?: number;
  rating?: number;
  duration?: string;
  posterImage?: string;
  backdropImage?: string;
  videoLink?: string;
  isLatest: boolean;
  isFeatured: boolean;
  views: number;
  externalId?: string;
  pipedId?: string;
  createdAt: Date;
}

const MusicVideoSchema = new Schema<IMusicVideo>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  description: { type: String },
  genre: [{ type: String }],
  releaseYear: { type: Number },
  rating: { type: Number, min: 0, max: 10 },
  duration: { type: String },
  posterImage: { type: String },
  backdropImage: { type: String },
  videoLink: { type: String },
  isLatest: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  externalId: { type: String, unique: true, sparse: true },
  pipedId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export const MusicVideo = mongoose.model<IMusicVideo>('MusicVideo', MusicVideoSchema);
