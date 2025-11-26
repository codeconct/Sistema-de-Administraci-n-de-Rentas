import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:UxAqPXgEMiITDqmftnGzmuxNMlQZOKKY@gondola.proxy.rlwy.net:25879/railway",
  ssl: { rejectUnauthorized: false },
});

export default pool;
