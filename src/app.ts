import express, { Application } from 'express';
import cors from 'cors';
import { borrowRoutes } from './controllers/borrow.controller';
import { bookRoutes } from './controllers/book.controller';

const app: Application = express();
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:5174', // frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);

app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Library Management API');
});

export default app;
