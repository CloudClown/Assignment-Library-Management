import { Router, Request, Response } from 'express';
import { Book } from '../models/book.model';
import { Borrow } from '../models/borrow.model';

export const borrowRoutes = Router();

// Borrow a book
borrowRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    // Check book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'Book not found',
      });
    }

    // Check quantity
    if (book.copies < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough copies available',
        error: 'Not enough copies',
      });
    }

    // Optional: Validate dueDate is in future
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Due date must be in the future',
        error: 'Invalid due date',
      });
    }

    // Update book copies
    book.copies -= quantity;
    await book.updateAvailability();

    // Create borrow record
    const borrow = new Borrow({ book: bookId, quantity, dueDate });
    await borrow.save();

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrow,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Borrow failed',
      error: error.message,
    });
  }
});

// Borrow summary
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
      { $unwind: '$bookDetails' },
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
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});
