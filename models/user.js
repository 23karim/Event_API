
import pool from "../configs/db.js";

const User = {

  create: async ({ nom, prenom, email, password, tel, role, image }) => {
    const validRoles = ["admin", "client"];
    const userRole = validRoles.includes(role) ? role : "client";

    const query = `
      INSERT INTO users (nom, prenom, email, password, tel, role, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [nom, prenom, email, password, tel, userRole, image];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  findByEmail: async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0]; 
  },
};

export default User;