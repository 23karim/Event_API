import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connecté à Neon PostgreSQL :", res.rows[0]);
  } catch (err) {
    console.error("❌ Erreur de connexion à Neon :", err);
  }
})();

export default pool;