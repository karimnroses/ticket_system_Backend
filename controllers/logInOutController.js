import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/*********************___LOGIN___*************************/
export const logIn = async (req, res) => {
    const { email, password } = req.body;
    let findUser;
    let role;

    
       await pool.query(
        `
          SELECT u.email, u.password, r.role FROM users u 
          JOIN roles r
          ON
          u.role_id = r.id
          WHERE email =$1;`,
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
            console.log(findUser.rows[0].role)
            //create and assign a token
            const token = jwt.sign({ email: findUser.rows[0].email}, process.env.JWT_SECRET, {
              expiresIn: "1h",
            })
            res.status(200).set("authorization", token).json( {role: findUser.rows[0].role} )
          }          
        }
      }
 


  