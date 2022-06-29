import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*********************___Get All User Tickets___*************************/
export const getAllMyTickets = async (res, req) => {
  const { username } = req.params;
  console.log(username);

  try {
    const findTickets = await pool.query(``);
  } catch {}
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