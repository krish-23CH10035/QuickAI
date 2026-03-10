import {neon} from '@neondatabase/serverless'

let sql;

try {
    sql = neon(process.env.DATABASE_URL || '');
} catch (error) {
    console.error("Database connection string missing or invalid.");
    console.error("Provided DATABASE_URL starts with:", process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + "..." : "UNDEFINED");
    console.error("Exact error:", error.message);
    sql = async () => { throw new Error("Database not connected") };
}

export default sql;
