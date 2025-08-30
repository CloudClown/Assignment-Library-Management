import { Schema, model } from 'mongoose';
import { IBorrow } from '../interfaces/borrow.interface';

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 }, // quantity >= 1
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Optional: Post-save logging (can keep or remove)
borrowSchema.post('save', function (doc) {
  console.log(`Borrow record created for book: ${doc.book}`);
});

export const Borrow = model<IBorrow>('Borrow', borrowSchema);
export type BorrowDocument = typeof Borrow;