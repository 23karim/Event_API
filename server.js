import "dotenv/config"; 
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import pool from "./configs/db.js";


const app = express();
//const hostname = "127.0.0.1"; 
const hostname = "0.0.0.0"; 
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev")); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

try {
  const dbStatus = await pool.query("SELECT NOW()");
  console.log("✅ Connecté à Neon PostgreSQL :", dbStatus.rows[0].now);
  
  app.listen(PORT, hostname, () => {
    console.log(`🚀 Server running at http://${hostname}:${PORT}/`);
  });
} catch (err) {
  console.error("❌ Erreur critique de connexion à la DB :", err);
  process.exit(1); 
}
