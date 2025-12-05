import multer from 'multer';

// Use memory storage for serverless compatibility
// Vercel serverless functions have a read-only filesystem except for /tmp
// Memory storage is more reliable and faster for serverless environments
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
})