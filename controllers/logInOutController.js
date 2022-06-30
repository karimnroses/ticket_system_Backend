import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/*********************___LOGIN___*************************/
export const logIn = async (req, res) => {
    const { email, password } = req.body;
    let findUser;
    
       await pool.query(
        `SELECT email, password FROM users WHERE email =$1;`,
        [email]
      ) //Verifying if the user exists
        .then((user) => { findUser  = user})
        .catch((err) => res.status(500).json({ err: err.message }));

          if(findUser.rowCount === 0) { //If the Email dont exist
            console.log("email don t exist")
            res.status(404).send("Invalid Email Or Password")
            
          } else { //If Email exists
            const storedPassword = findUser.rows[0].password;
            //Compare the given password with the stored user's password
            const isPasswordCorrect   =  await bcrypt.compare(password, storedPassword)
            
            console.log(isPasswordCorrect)
          if (!isPasswordCorrect) {
            console.log("password not match");
            res.status(400).send("Invalid Email Or Password");
          } else{
            console.log("password match");
            //create and assign a token
            const token = jwt.sign({ email: findUser.rows[0].email }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            })
            res.status(200).set("authorization", token).send("Login successfully")
          }          
        }
    
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
        
        
       
     
      }
 


  /*********************___ ___*************************/
  