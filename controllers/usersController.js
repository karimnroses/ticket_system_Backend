import pool from "../db/pg.js";

export const getAllUsers = (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then((data) => res.status(200).json({ users: data.rows }))
    .catch((err) => res.status(500).json(err));
};
