import { Router, Request, Response } from 'express';
import { Book } from '../models/book.model';


export const bookRoutes = Router();


// Create Book
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
      message: 'Validation failed',
      success: false,
      error: error.errors || error.message,
    });
  }
});

// Get All Books
bookRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10 } = req.query;
    const query = filter ? { genre: filter } : {};
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .limit(Number(limit));
    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
});

// Get Book by ID
bookRoutes.get('/:bookId', async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
        success: false,
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
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
});

// Update Book
bookRoutes.patch('/:bookId', async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
        success: false,
        error: 'Book not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Validation failed',
      success: false,
      error: error.errors || error.message,
    });
  }
});

// Delete Book
bookRoutes.delete('/:bookId', async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      return res.status(404).json({
        message: 'Book not found',
        success: false,
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
      message: 'Server error',
      success: false,
      error: error.message,
    });
  }
});

