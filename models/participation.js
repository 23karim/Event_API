import pool from "../configs/db.js";

const Participation = {
  add: async (userId, eventId) => {
    const query = `
      INSERT INTO participations (user_id, event_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, eventId]);
    return rows[0];
  },

  checkIfAlreadyParticipating: async (userId, eventId) => {
    const query = `SELECT * FROM participations WHERE user_id = $1 AND event_id = $2`;
    const { rows } = await pool.query(query, [userId, eventId]);
    return rows.length > 0;
  },

  getParticipantsByEvent: async (eventId, limit, offset) => {
    const query = `
      SELECT 
        u.id, 
        u.nom, 
        u.prenom, 
        u.email, 
        u.tel, 
        u.image, 
        p.participated_at
      FROM users u
      JOIN participations p ON u.id = p.user_id
      WHERE p.event_id = $1
      ORDER BY p.participated_at DESC
      LIMIT $2 OFFSET $3;
    `;
    
    const countQuery = `SELECT COUNT(*) FROM participations WHERE event_id = $1;`;

    const participantsRes = await pool.query(query, [eventId, limit, offset]);
    const countRes = await pool.query(countQuery, [eventId]);

    return {
      participants: participantsRes.rows,
      total: parseInt(countRes.rows[0].count)
    };
  },

  getMyParticipations: async (userId) => {
    const query = `
      SELECT 
        e.id, 
        e.titre, 
        e.description, 
        e.date_debut, 
        e.date_fin, 
        e.lieu, 
        e.prix, 
        e.image,
        p.participated_at,
        (SELECT COUNT(*) FROM participations WHERE event_id = e.id) as participants_count
      FROM events e
      JOIN participations p ON e.id = p.event_id
      WHERE p.user_id = $1
      ORDER BY p.participated_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },
};

export default Participation;