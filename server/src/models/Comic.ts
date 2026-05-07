import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter {
  chapterNumber: number;
  title?: string;
  pages: string[];
  publishedDate?: Date;
  readLink?: string;
  mangaDexChapterId?: string;
}

export interface IComic extends Document {
  title: string;
  author?: string;
  artist?: string;
  genre?: string[];
  type: 'comic' | 'manga' | 'manhwa';
  status: 'ongoing' | 'completed';
  releaseYear?: number;
  coverImage?: string;
  description?: string;
  chapters: IChapter[];
  isLatest: boolean;
  isFeatured: boolean;
  views: number;
  tags?: string[];
  mangaDexId?: string;
  createdAt: Date;
}

const ChapterSchema = new Schema<IChapter>({
  chapterNumber: { type: Number, required: true },
  title: { type: String },
  pages: [{ type: String }],
  publishedDate: { type: Date },
  readLink: { type: String },
  mangaDexChapterId: { type: String },
});

const ComicSchema = new Schema<IComic>({
  title: { type: String, required: true },
  author: { type: String },
  artist: { type: String },
  genre: [{ type: String }],
  type: { type: String, enum: ['comic', 'manga', 'manhwa'], default: 'comic' },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  releaseYear: { type: Number },
  coverImage: { type: String },
  description: { type: String },
  chapters: [ChapterSchema],
  isLatest: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  tags: [{ type: String }],
  mangaDexId: { type: String },
}, { timestamps: true });

export const Comic = mongoose.model<IComic>('Comic', ComicSchema);