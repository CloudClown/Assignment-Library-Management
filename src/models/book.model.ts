import { Schema, model } from 'mongoose';
import { Genre, IBook } from '../interfaces/books.interface';


const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, enum: Object.values(Genre), required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save middleware to set available based on copies
bookSchema.pre('save', function (next) {
  this.available = this.copies > 0;
  next();
});

// Instance method to update availability
bookSchema.methods.updateAvailability = async function () {
  this.available = this.copies > 0;
  await this.save();
};

export const Book = model<IBook>('Book', bookSchema);