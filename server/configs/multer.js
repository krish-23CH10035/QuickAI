import multer from 'multer';

// Configure multer storage (in-memory storage for simplicity)
const storage = multer.diskStorage({});

export const upload = multer({storage})