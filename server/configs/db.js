import {neon} from '@neondatabase/serverless'

let sql;

try {
    sql = neon(process.env.DATABASE_URL || '');
} catch (error) {
    console.error("Database connection string missing or invalid. Set DATABASE_URL.");
    sql = async () => { throw new Error("Database not connected") };
}

export default sql;
