import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


/*********************___Create a New Company__*************************/
export const createNewCompany = async (req, res) => {
  try {
    const { company_name, adress, number, zip, city, country } = req.body;

    await pool.query(
      `
      SELECT * FROM company WHERE name = $1;
      `
      ,[company_name]
    )
    .then((company) => {
      if(company.rowCount !== 0){
        res.status(409).json("Company already exists")
      } else {
         pool.query(
          `
          INSERT INTO company 
          (name, adress, number, zip, city, country)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
          `,
          [company_name, adress, number, zip, city, country]
        )
        .then(result => res.status(201).json(result))
        .catch(err => res.status(500).json({error : err.message}))
      }
    })
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*********************___Create a New User___*************************/
export const createNewUser = async (req, res) => {
  let company_id;
  let role_id;
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      username,
      company_name,
      adress,
      number,
      zip,
      city,
      country,
      role,
    } = req.body;

    await pool
      .query(`SELECT id FROM roles WHERE role = $1;`, [role])
      .then((roleID) => (role_id = roleID.rows[0].id)); //Get the role ID from roles Table
    const hashedPassword = await bcrypt.hash(password, 10);

    //Check if Username OR Email  already used
    await pool
      .query(`SELECT * FROM users WHERE  email = $1 OR username = $2;`, [
        email,
        username,
      ])
      .then((user) => {
        if (user.rowCount == 0) {
          //Username OR Email not used
          pool
            .query(
              //Check if Company already exists
              `SELECT * FROM company WHERE name=$1;`,
              [company_name]
            )
            .then((company) => {
              if (company.rowCount == 0) {
                //company dont exists => Add new Company first
                pool
                  .query(
                    `INSERT INTO company (name, adress, number, zip, city, country)
               VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
                    [company_name, adress, number, zip, city, country]
                  )
                  .then((addedCompany) => {
                    company_id = addedCompany.rows[0].id; //Get the Id from the new Company (To insert in Users as company_id)
                    //console.log(`company ID: ${company_id}`);
                    if (company_id) {
                      pool
                        .query(
                          `INSERT INTO users (email, password, first_name, last_name, username, company_id, role_id)
                  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
                          [
                            email,
                            hashedPassword,
                            first_name,
                            last_name,
                            username,
                            company_id,
                            role_id,
                          ]
                        )
                        .then((user) => {
                          const newUser = user.rows[0];
                          console.log(newUser);

                          const token = jwt.sign(
                            { email: user.email }, //payload
                            process.env.JWT_SECRET, //secret
                            { expiresIn: "1h" } //options
                          );
                          //console.log(token);
                          if (token) {
                            res
                              .status(201)
                              .set("Authorization", token) //fügt dem Header der Response ein Feld "Authorization" hinzu mit dem Wert des tokens
                              .json(user);
                          }
                        })
                        .catch((err) => res.json(err));
                    }
                  });
              } else {
                console.log("Company Already Exists");
                //If the Company already exists --> Get the Company ID from the Response
                company_id = company.rows[0].id;
                pool
                  .query(
                    `INSERT INTO users (email, password, first_name, last_name, username, company_id, role_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
                    [
                      email,
                      hashedPassword,
                      first_name,
                      last_name,
                      username,
                      company_id,
                      role_id,
                    ]
                  )
                  .then((user) => {
                    console.log(user.rows[0]);
                    //token kreieren
                    const token = jwt.sign(
                      { email: user.email }, //payload
                      process.env.JWT_SECRET, //secret
                      { expiresIn: "1h" } //options
                    );
                    //console.log(token);
                    if (token) {
                      res
                        .status(201)
                        .set("Authorization", token) //fügt dem Header der Response ein Feld "Authorization" hinzu mit dem Wert des tokens
                        .json(user);
                    }
                  })
                  .catch((err) => res.json(err));
              }
            });
        } else {
          console.log("Username Or Email Already used!!");
          res.send("User already exists");
        }
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*********************___Delete User ___*************************/
export const deleteUser = async (req, res) => {
  const { email, username, adminPassword, adminUsername } = req.body;
  //Check if the user exists
  try {
    await pool
      .query(`SELECT * FROM users WHERE  email = $1 AND username = $2;`, [
        email,
        username,
      ])
      .then((user) => {
        if (user.rowCount == 0) {
          res.status(404).json("User not found");
        } else {
          pool.query(
            //Get the Admin Password from the Database
            `SELECT password FROM users WHERE username = $1;`,
            [adminUsername],
            (err, result) => {
              const adminStoredPassword = result.rows[0].password;
              //Compare the given password with the stored password
              bcrypt
                .compare(adminPassword, adminStoredPassword)
                .then((result) => {
                  if (result) {
                    //Password matches
                    pool.query(
                      `Delete from users WHERE username = $1 AND email = $2 RETURNING *`,
                      [username, email],
                      (err, result) => {
                        if (err) {
                          throw err;
                        }
                        res.status(200).json("User successfully deleted");
                      }
                    );
                  } else {
                    //Password does not match
                    res.status(200).json("Something went wrong!!");
                  }
                });
            }
          );
        }
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*********************___Update existing User___*************************/
export const updateUser = async (req, res) => {};

/*********************___Get a list of all users___*************************/
export const getAllUsers = async (req, res) => {
  const { company_name } = req.body;
  try {
    await pool.query(
      `SELECT  u.id AS "user_id", first_name, last_name, email, username, name AS "company_Name" FROM users u
      INNER JOIN company c
      ON u.company_id = c.id
      ORDER BY c.name ASC;`,
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        }
        console.log(result.rows);
        res.status(200).json(result);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*********************___Delete User Ticket___*************************/
export const deleteUserTicket = async (req, res) => {
  const { ticket_id, email, username, adminPassword, adminUsername } = req.body;
};

/*********************___Update existing Ticket ___*************************/
export const updateTicket = async (req, res) => {
  const { id, new_ticket_status_id } = req.body; //Hier soll im Frontend Wenn admin einen Status gewählt hat nur die ID des gewählten Status in die Request geschickt werden

  const findTicket = await pool.query(`SELECT * FROM Ticketit WHERE id = $1`, [
    id,
  ]);
  if (findTicket.rowCount === 0) {
    res.status(404).json("Ticket not found");
  } else {
    await pool
      .query(`UPDATE ticketit SET status_id = $1 WHERE id = $2 RETURNING *;`, [
        new_ticket_status_id,
        id,
      ])
      .then((results) => {
        res.status(200).json("Status successfully updated");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  }
};

/*********************___Get All the Ticket from one User___*************************/
export const getCompanyTickets = async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query(
      `
    SELECT t.id, t.subject ,c.name, u.username
    FROM company c
    JOIN users u
    ON c.id = u.company_id
    JOIN ticketit t
    ON u.id = t.user_id
    WHERE c.name = $1
    ORDER BY c.name ASC
    `,
      [name],
      (err, result) => {
        if (result.rowCount === 0) {
          res.status(404).json("The selected company has no Tickets");
        } else {
          console.log(result.rows);
          res.status(200).json(result);
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*********************___Get all the Tickets from All Users___*************************/
export const getTicketsFromAllUsers = async (req, res) => {
  const { orderBy, ascOrDesc } = req.body;
  try {
    await pool
      .query(
        `
    SELECT 
    t.subject, t.content, t.created_at, t.completed_at, t.img_url,
    u.first_name, u.last_name, u.username, u.email,
    c.name,
    ca.name, ca.color,
    s.status, s.color
    FROM ticketit t
    JOIN users u
    ON t.user_id = u.id
    JOIN company c
    ON u.company_id = c.id
    JOIN ticketit_category ca
    ON t.category_id = ca.id
    JOIN ticketit_status s
    ON t.status_id = s.id
    ORDER BY ${orderBy} ${ascOrDesc}
    `
      )
      .then((results) => {
        if (results.rowCount === 0) {
          res.status(404).json("The selected company has no Tickets");
        } else {
          res.status(200).json(results);
        }
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*********************___Get Infos from a User___*************************/
export const getCompanyInfos = async (req, res) => {
  const { company_name } = req.body;

  try {
    await pool
      .query(
        `
      SELECT 
      name, adress, number, zip, city, country
      FROM company
      WHERE name = $1
      `,
        [company_name]
      )
      .then((results) => {
        if (results.rowCount === 0) {
          res.status(404).json("Something went wrong!!");
        } else {
          res.status(200).json(results);
        }
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
