import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*********************___Get All User Tickets___*************************/
export const getAllMyTickets = async (res, req) => {
  const { username } = req.params;

  try {
    const findTickets = await pool.query(``);
  } catch {}
};

/*********************___Update Tickets from User___*************************/
export const updateTicket = async (res, req) =>{
  const { username } = req.params;
  const { subject, content} = req.body;
  
}

/*********************___Create a New Ticket from User___*************************/
export const createNewTicket = (req, res) => {
  const { username } = req.params;
  const { subject, content } = req.body;

}

/*********************___Get My User Infos___*************************/
export const getMyInfos = (req, res) => {
  const { username } = req.params;

}

/*********************___Update my Contact Data___*************************/
export const updateMyContactData = (req, res) =>  {
  const { username } = req.params;
  const { currentPassword, newPassword, currenEmail, newEmail } = req.body;

}