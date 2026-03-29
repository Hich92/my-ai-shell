import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://myuser:mypassword@127.0.0.1:5433/ai_shell_db?schema=public",
});
