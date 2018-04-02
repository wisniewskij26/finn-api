import { Pool } from "pg";

export let pool: Pool;

export const init = () => {
  if (!pool) {
    const ENV = process.env.NODE_ENV || "development";
    let connectionString;
    if (ENV === "production") {
      connectionString = process.env.DATABASE_URL;
    }

    if (ENV === "test") {
      connectionString = process.env.TEST_DB;
    }

    if (ENV === "development") {
      connectionString = process.env.DB_DEV;
    }

    pool = new Pool({
      connectionString
    });
  }
};

export const end = async () => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};

export const query = async (queryText: string, values: any[] = []) => {
  return await pool.query(queryText, values);
};

export const one = async (queryText: string, values: any[] = []) => {
  const res = await query(queryText, values);
  return res.rows[0];
};