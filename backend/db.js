import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres.ckxadrogfdgzlsrpwmvt:S7LwgfkwmM7K6izM@aws-1-us-east-2.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

export default pool;
