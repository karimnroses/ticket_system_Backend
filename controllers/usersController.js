import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// export const getAllUsers = (req, res) => {
//   pool
//     .query("SELECT * FROM users")
//     .then((data) => res.status(200).json({ users: data.rows }))
//     .catch((err) => res.status(500).json(err));
// };

export const logIn =  async (req, res) => {
  const { email, password} = req.body;
  try {
    const findUser = await pool.query(
      `SELECT email, password FROM users WHERE email =$1;`,
      [email]
     ); //Verifying if the user exists in the database
    //console.log(findUser.rows[0].password);
    const user = findUser.rows[0];
    console.log(user.password)
    console.log(password)
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect); //returnt true oder false
    //Falls ja token kreieren und zurückschicken
    if (isPasswordCorrect) {
      console.log("password match")
      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).set("Authorization", token).send("Login successful");
    } else {
      console.log("password not match")
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
