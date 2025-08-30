import express, { Application } from 'express';
import cors from 'cors';
import { borrowRoutes } from './controllers/borrow.controller';
import { bookRoutes } from './controllers/book.controller';

const app: Application = express();
app.use(express.json());

// Enable CORS for multiple origins
const allowedOrigins = [
  'http://localhost:5174', // local dev
  'https://redux-toolkit-assignment-b5-a4.vercel.app' // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);

app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Library Management API');
});

export default app;
