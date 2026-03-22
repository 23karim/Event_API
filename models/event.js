
import pool from "../configs/db.js";

const Event = {
  create: async ({ titre, description, date_debut, date_fin, prix, lieu, image, admin_id }) => {
    const query = `
      INSERT INTO events (titre, description, date_debut, date_fin, prix, lieu, image, admin_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [titre, description, date_debut, date_fin, prix, lieu, image, admin_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const query = `DELETE FROM events WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  deleteAll: async () => {
    const query = `DELETE FROM events RETURNING *;`;
    const { rows } = await pool.query(query);
    return rows;
  },
  getAll: async (limit, offset) => {
    const eventsQuery = `
      SELECT 
        e.*, 
        u.nom as admin_nom,
        (SELECT COUNT(*) FROM participations p WHERE p.event_id = e.id) as participants_count
      FROM events e
      LEFT JOIN users u ON e.admin_id = u.id
      ORDER BY e.date_debut ASC
      LIMIT $1 OFFSET $2;
    `;
    
    const countQuery = `SELECT COUNT(*) FROM events;`;

    const eventsRes = await pool.query(eventsQuery, [limit, offset]);
    const countRes = await pool.query(countQuery);

    return {
      events: eventsRes.rows,
      total: parseInt(countRes.rows[0].count)
    };
  },
  getById: async (id) => {
    const query = `
      SELECT 
        e.*, 
        u.nom as admin_nom,
        (SELECT COUNT(*) FROM participations p WHERE p.event_id = e.id) as participants_count
      FROM events e
      LEFT JOIN users u ON e.admin_id = u.id
      WHERE e.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

export default Event;