import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import cloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
dotenv.config();

const app = express();

// importing `cloudinary` configures the SDK (no async initialization required)

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('Server is Live'))

app.use(requireAuth())

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter);      

// Export the Express app for Vercel serverless functions
export default app;

// Only start server if running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Server running on port', PORT);
    });
}
