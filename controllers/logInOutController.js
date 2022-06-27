import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*********************___LOGIN___*************************/
export const logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
      const findUser = await pool.query(
        `SELECT email, password FROM users WHERE email =$1;`,
        [email]
      ); //Verifying if the user exists
      const user = findUser.rows[0];
      console.log(user.password);
      console.log(password);
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      //const isPasswordCorrect = password === user.password ? "true" : "false";
      console.log(isPasswordCorrect);
      if (isPasswordCorrect) {
        console.log("password match");
        //create and assign a token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        //Send User/Admin Details && Content
        // const findUserDetails = await pool.query(
        //   `SELECT company.name, users.username, roles.role 
        //   FROM company
        //   INNER JOIN users ON company.id = users.company_id
        //   INNER JOIN roles ON roles.id = users.role_id
        //   WHERE email = $1; 
        //    `,
        //   [email]
        // );
        res.status(200).set("authorization", token).send("Login successful");
        
       
      } else {
        console.log("password not match");
        res.status(401).send("Unauthorized");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  /*********************___ ___*************************/
  