import { Router, Request, Response } from 'express';
import { Book } from '../models/book.model';
import { Borrow } from '../models/borrow.model';


export const borrowRoutes = Router();

// Borrow Book
borrowRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
        success: false,
        error: 'Book not found',
      });
    }
    if (book.copies < quantity) {
      return res.status(400).json({
        message: 'Not enough copies available',
        success: false,
        error: 'Not enough copies',
      });
    }

    book.copies -= quantity;
    await book.updateAvailability();
    await book.save();

    const borrow = new Borrow({ book: bookId, quantity, dueDate });
    await borrow.save();

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrow,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Borrow failed',
      success: false,
      error: error.message,
    });
  }
});

// Borrowed Books Summary
borrowRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails',
        },
      },
      {
        $unwind: '$bookDetails',
      },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookDetails.title',
            isbn: '$bookDetails.isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
});

