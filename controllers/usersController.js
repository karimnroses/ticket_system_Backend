import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*********************___Get All User Tickets___*************************/
export const getAllMyTickets = async (req, res) => {
    const { id } = req.params;
    console.log(id)
  // console.log(req.params)
  
  await pool
    .query(
  `
    SELECT * FROM ticketit t
    JOIN users u
    ON u.id = t.user_id
    Where u.id = $1
    ORDER BY t.created_at DESC
  `,
      [id]
    )
    .then((result) => {
      if (result.rowCount == 0) {
        res.status(404).json("The user has no Tickets");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((error) =>  {res.status(500).json({ error: error.message })})
};


/*********************___Create a New Ticket from User___*************************/
export const createNewTicket = (req, res) => {
  const { username } = req.params;
  const { subject, content } = req.body;



}

/*********************___Verify Session___*************************/
export const verifySession = (req, res) => {
  res.status(200).send("Token successfully verified");
};