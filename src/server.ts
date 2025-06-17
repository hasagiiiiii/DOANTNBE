import { Pool } from 'pg'

const pool = new Pool({
    host: "localhost",
    database: "DoAnTotNghiep",
    port: 5432,
    user: "TrungLiver",
    password: "riven11A",
})

export const runQuery = async (query: string, params: any) => {
    const client = await pool.connect();
    try {
        const res = await client.query(query, params);

        return res;
    } catch (err: any) {
        console.error("Error executing query", err.stack);
    } finally {
        client.release();
    }
};
export const checkConnection = async () => {
    try {
        const client = await pool.connect();
        client.release();
    } catch (err: any) {
        console.error("Error connecting to the database", err.stack);
    }
};
