import { Schema, model } from 'mongoose';
import { Genre, IBook } from '../interfaces/books.interface';

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, enum: Object.values(Genre), required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0, default: 1 }, // Fix 2: default copies
    available: { type: Boolean, default: true, immutable: true },  // Fix 3: availability derived from copies
  },
  { timestamps: true }
);


bookSchema.pre('save', function (next) {
  this.available = this.copies > 0;
  next();
});


bookSchema.methods.updateAvailability = async function () {
  this.available = this.copies > 0;
  await this.save();
};


export const Book = model<IBook>('Book', bookSchema);
export type BookDocument = typeof Book;