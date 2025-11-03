import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import errorHandler from './middleware/errorHandler';
import { connectDB } from './config/database';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('Fix Master Backend is running!');
});

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});