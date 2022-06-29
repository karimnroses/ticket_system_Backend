import pkg from "pg";

const { Pool } = pkg;
const connectionString = process.env.PG_CONNECT;

const pool = new Pool({ connectionString, ssl: true });

export default pool;