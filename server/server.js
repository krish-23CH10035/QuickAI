import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import cloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';


const app = express();
console.log("=== RAILWAY ENV CHECK ===");
console.log("ENV KEYS:", Object.keys(process.env).filter(k => !k.startsWith('npm_')));
console.log("==========================");
// importing `cloudinary` configures the SDK (no async initialization required)

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY
}));

app.get('/', (req, res) => res.send('Server is Live'))

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter);

// Public stats — no auth needed
app.get('/api/stats', async (req, res) => {
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    const [articles] = await sql`SELECT COUNT(*) FROM creations WHERE type IN ('article','Blog-title','resume-review')`;
    const [images]   = await sql`SELECT COUNT(*) FROM creations WHERE type = 'image'`;
    const [users]    = await sql`SELECT COUNT(DISTINCT user_id) FROM creations`;
    res.json({
      success: true,
      articles: parseInt(articles.count),
      images:   parseInt(images.count),
      users:    parseInt(users.count),
    });
  } catch (e) {
    res.json({ success: false, articles: 0, images: 0, users: 0 });
  }
});

// Export the Express app for Vercel serverless functions
export default app;

// Only start server if running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Server running on port', PORT);
    });
}
