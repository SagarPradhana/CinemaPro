import mongoose, { Schema, Document } from 'mongoose';

export interface IMusic extends Document {
  title: string;
  artist: string;
  album?: string;
  genre?: string[];
  language?: string;
  releaseYear?: number;
  duration?: string;
  coverImage?: string;
  musicLink?: string;
  lyrics?: string;
  isLatest: boolean;
  isFeatured: boolean;
  plays: number;
  tags?: string[];
  externalId?: string;
  deezerId?: number;
  createdAt: Date;
}

const MusicSchema = new Schema<IMusic>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  genre: [{ type: String }],
  language: { type: String },
  releaseYear: { type: Number },
  duration: { type: String },
  coverImage: { type: String },
  musicLink: { type: String },
  lyrics: { type: String },
  isLatest: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  plays: { type: Number, default: 0 },
  tags: [{ type: String }],
  externalId: { type: String, unique: true, sparse: true },
  deezerId: { type: Number, unique: true, sparse: true },
}, { timestamps: true });

export const Music = mongoose.model<IMusic>('Music', MusicSchema);