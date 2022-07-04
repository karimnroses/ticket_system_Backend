import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginValidation} from "../validation.js";


/*********************___LOGIN___*************************/
export const logIn = async (req, res) => {
    // Validate the user input
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    let findUser;
    let role;

    
       await pool.query(
        `
          SELECT u.id AS "user_id", u.email, u.password, u.first_name, u.last_name, u.username,
          r.role,
          c.id AS "company_id", c.name AS "company_name"
          FROM users u 
          JOIN roles r
          ON
          u.role_id = r.id
          JOIN company c
          ON u.company_id = c.id
          WHERE u.email =$1;`,
        [email]
      ) //Verifying if the user exists
        .then((user) => { findUser  = user})
        .catch((err) => res.status(500).json({ err: err.message }));

          if(findUser.rowCount === 0) { //If the Email dont exist
            console.log("email don t exist")
            res.status(404).send("Invalid Email Or Password")
            
          } else { //If Email exists
            const storedPassword = findUser.rows[0].password;
            role = findUser.rows[0].role
            //Compare the given password with the stored user's password
            const isPasswordCorrect   =  await bcrypt.compare(password, storedPassword)
            
            console.log(isPasswordCorrect)
          if (!isPasswordCorrect) {
            console.log("password not match");
            res.status(400).send("Invalid Email Or Password");
          } else{
            console.log("password match");
            delete findUser.rows[0]['password'] //Remove password from the JSON response
            //create and assign a token
            const token = jwt.sign({ email: findUser.rows[0].email}, process.env.JWT_SECRET, {
              expiresIn: "1h"
            })
            res.status(200).set("Authorization", token).json( {user: findUser} )
          }          
        }
      }
 


  /*********************___Verify Session___*************************/
export const verifySession = (req, res) => {
  res.status(200).send("Token successfully verified");
};