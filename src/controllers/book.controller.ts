import { Router, Request, Response } from 'express';
import { Book } from '../models/book.model';

export const bookRoutes = Router();

// Create book
bookRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.errors || error.message,
    });
  }
});

// Get all books with filter, sort, and pagination
bookRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10, page = 1 } = req.query;

    const query: any = filter ? { genre: filter } : {};

    const totalBooks = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
      pagination: {
        total: totalBooks,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalBooks / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// Get book by ID
bookRoutes.get('/:bookId', async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'Book not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// Update book
bookRoutes.patch('/:bookId', async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'Book not found',
      });
    }

    // Update availability after changing copies
    await book.updateAvailability();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.errors || error.message,
    });
  }
});

// Delete book
bookRoutes.delete('/:bookId', async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'Book not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});
