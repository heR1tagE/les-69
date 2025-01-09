import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import assignmentsRoutes from './routes/assignments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Підключення CORS та Body Parser
app.use(cors());
app.use(bodyParser.json());

// Підключення маршруту assignments
app.use('/api', assignmentsRoutes);

// Підключення до MongoDB через Mongoose
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultDB')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
