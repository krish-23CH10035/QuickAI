import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
	throw new Error('Missing required environment variable: DATABASE_URL. Please set DATABASE_URL in your environment (e.g., Vercel Project Settings).');
}

const sql = neon(process.env.DATABASE_URL);

export default sql;
