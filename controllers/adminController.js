import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/*********************___Create a New User___*************************/
export const createNewUser = async (req, res) => {
  let company_id;
  let role_id;
    try {
      const { email, password, first_name, last_name, username, company_name, adress, number, zip, city, country, role } = req.body;
      await pool.query(`SELECT id FROM roles WHERE role = $1;`, [role]).then((roleID) => role_id = roleID.rows[0].id) //Get the Role ID from roles Table
      const hashedPassword = await bcrypt.hash(password, 10);
      //Check if Username OR Email  already exist 
       await pool.query(
        `SELECT * FROM users WHERE  email = $1 OR username = $2;`, [email, username]
      ).then((user) =>{
         if(user.rows.length == 0){         //Username OR Email not used
           pool.query(                  //Check if Company already exists 
            `SELECT * FROM company WHERE name=$1;`, [company_name]
          ).then((company) =>{
            if(company.rows.length == 0){  //company dont exists => Add new Company first
              pool.query(`INSERT INTO company (name, adress, number, zip, city, country) 
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, 
               [company_name, adress, number, zip, city, country]
              ).then((addedCompany) => {
                company_id = addedCompany.rows[0].id //Get the Id from the new added Company (To insert in Users as company_id)
                console.log(`company ID: ${company_id}`)
                if(company_id !== 0){
                  pool.query(
                  `INSERT INTO users (email, password, first_name, last_name, username, company_id, role_id)
                  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, [email, hashedPassword, first_name, last_name, username, company_id, role_id]
                ).then((createdUser) =>{
                 const newUser = createdUser.rows[0];
                  console.log(createdUser.rows[0])
               })
                .catch((err) => res.json(err));
              }
              }
              )
            } else {
                console.log("Company Already Exists")
                //If the Company already exists --> Get the Company ID from the Response
              company_id = company.rows[0].id;
              pool.query(
                `INSERT INTO users (email, password, first_name, last_name, username, company_id, role_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, [email, hashedPassword, first_name, last_name, username, company_id, role_id]
              ).then((user) =>{
                console.log(user.rows[0])
              })
              .catch((err) => res.json(err))
            }
          }) 
         } else {
            console.log("Username Or Email Already used!!")
         }
          
      })
     
      
      //token kreieren
      const token = jwt.sign(
        { email: email }, //payload
        process.env.JWT_SECRET, //secret
        { expiresIn: "1h" } //options
      );
      //console.log(token);
      if (token ) {
        res
          .status(201)
          .set("Authorization", token) //fügt dem Header der Response ein Feld "Authorization" hinzu mit dem Wert des tokens
          .send("User successfully created");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  /*********************___Delete existing User___*************************/
export const updateUser = (req, res) => {
    
}


  /*********************___Update User Contacts___*************************/
  export const deleteUser = (req, res) => {
    
  }
  
  
  /*********************___Get a list of all users___*************************/
  export const getAllUsers = (req, res) => {
    
  }
  

/*********************___Delete existing User Ticket___*************************/
export const deleteUserTicket = (req, res) => {
    
}

/*********************___Update existing Ticket ___*************************/
export const updateTicket = (req, res) => {
    
}

/*********************___Get All the Ticket from one User___*************************/
export const getUserTickets = (req, res) => {
    
}

/*********************___Get Infos from a User___*************************/
export const getUserInfos = (req, res) => {
    
}

/*********************___Get all the Tickets from All Users___*************************/
export const getTicketsFromAllUsers = (req, res) => {
    
}