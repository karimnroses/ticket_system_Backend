import pool from "../db/pg.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*********************___Create a New Company__*************************/
export const createNewCompany = async (req, res) => {

    const { company_name, adress, number, zip, city, country, status_id } =
      req.body;
    await pool
      .query(
        `
      SELECT * FROM company WHERE name = $1;
      `,
        [company_name]
      )
      .then((company) => {
        if (company.rowCount > 0) {
          res.status(409).json("Company already exists");
        } else {
          const status_id = 1; //Standards status for new created company is "aktiv" -> ID = 1. take a look at the company_status
          pool
            .query(
              `
          INSERT INTO company 
          (name, adress, number, zip, city, country, status_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
          `,
              [company_name, adress, number, zip, city, country, status_id]
            )
            .then((result) => res.status(201).json(result));
        }
      });
};

/*********************___Create a New User___*************************/
export const createNewUser = async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    username,
    company_name,
    role,
  } = req.body;

  let company_id;
  let role_id;

  const hashedPassword = await bcrypt.hash(password, 10); // password hashing

  await pool
    .query(`SELECT id FROM roles WHERE role = $1;`, [role])
    .then((roleID) => {
      role_id = roleID.rows[0].id; //Get the role ID from roles Table
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });

  //Check if Username OR Email  already used
  pool
    .query(
      `SELECT email, username FROM users WHERE  email = $1 OR username = $2;`,
      [email, username]
    )

    .then((user) => {
      if (user.rowCount > 0) {
        //Username Or Email already exist
        res.status(409).json("User already exists");
      } else {
        //User don t exist
        //GET The Company_ID from the given Company
        pool
          .query(`SELECT id FROM company WHERE name = $1;`, [company_name])
          .then((companyID) => {
            company_id = companyID.rows[0].id;
          })
          .then(() => {
            pool
              .query(
                `
            INSERT INTO users 
            (email, password, first_name, last_name, username, company_id, role_id)
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
            `,
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
                const token = jwt.sign(
                  { email: newUser.email }, //payload
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
              .catch((err) => res.json({ err: err.message }));
          })
          .catch((err) => res.json({ err: err.message }));
      }
    });
};

/*********************___Delete User ___**************************/ 
export const updateCompanysStatus = async (req, res) => {
  const { company_id } = req.params;
  const { new_status} = req.body;
 
  if(typeof new_status === 'number'){
    await pool
    .query(`UPDATE company SET status_id = $1 WHERE id = $2 RETURNING *;`, [
      new_status,
      company_id,
    ])
    .then((results) => {
      res.status(201).json(results);
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    })
  } else {
    res.status(500).json("The given status is not a number")
  }
 
};
  
/*********************___Get the list of all the companies___*************************/
export const getAllCompanies = async (req, res) => {
    await pool.query(
      `SELECT  u.id AS "user_id", c.id AS "Company_id",  name AS "company_Name", first_name, last_name, email, username FROM users u
      INNER JOIN company c
      ON u.company_id = c.id
      ORDER BY c.name ASC;`)
      .then((result)=>{
        res.status(200).json(result);
      })
      .catch((error) => { res.status(500).json({ error: error.message })}) 
};


/*********************___Update existing Ticket ___*************************/
export const updateTicket = async (req, res) => {
  const { new_ticket_status_id } = req.body;
  const { ticket_id } = req.params;
   /*
      Hier soll im Frontend Wenn admin einen Status gewählt hat nur die ID des gewählten Status in die Request geschickt werden
      Zum Beispiel wenn admin den Status "open" wählt, soll der Value des dropdown button 1 sein und nicht "open"
      Bitte in die Tabelle ticketit_status die ID´s herausinden für jeden Status.
      Der ticket_id wird mit jedem Ticket zurückgeliefert => getCompanyTickets()
  */
     pool
      .query(`UPDATE ticketit SET status_id = $1 WHERE id = $2 RETURNING *;`, [
        new_ticket_status_id,
        ticket_id,
      ])
      .then((results) => {
        res.status(201).json(results);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
};

/*********************___Get All the Ticket from one User___*************************/
export const getCompanyTickets = async (req, res) => {
  const { company_id } = req.params;
  console.log(company_id);

    await pool
      .query(
        `
    SELECT t.id, t.subject ,c.name, u.username
    FROM company c
    JOIN users u
    ON c.id = u.company_id
    JOIN ticketit t
    ON u.id = t.user_id
    WHERE c.id = $1
    ORDER BY c.name ASC
    `,
        [company_id]
      )
      .then((result) => {
        if (result.rowCount == 0) {
          res.status(404).json("The selected company has no Tickets");
        } else {
          res.status(200).json(result);
        }
      })
      .catch((error) =>  {res.status(500).json({ error: error.message })})

    
};

/*********************___Get all the Tickets from All Users___*************************/
export const getTicketsFromAllUsers = async (req, res) => {
  const { orderBy, ascOrDesc } = req.body;

    await pool
      .query(
        `
    SELECT 
    t.subject, t.content, t.created_at, t.completed_at, t.img_url,
    u.first_name, u.last_name, u.username, u.email,
    c.name As "Company",
    ca.name AS "category", ca.color AS "category_color",
    s.status, s.color AS "status_Color"
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
          res.status(404).json("Ther s no Tickets");
        } else {
          res.status(200).json(results);
        }
      })
      .catch((error) => { res.status(500).json({ error: error.message }) 
    })
};

/*********************___Get Infos from a User___*************************/
export const getCompanyInfos = async (req, res) => {
  const { company_id } = req.params;


    await pool
      .query(
        `
      SELECT 
      name, adress AS "street", number AS "street number", zip, city, country, phone, email
      FROM company
      WHERE id = $1
      `,
        [company_id]
      ) 
      .then((results) => {
        if (results.rowCount === 0) {
          res.status(404).json("Something went wrong!!");
        } else {
          res.status(200).json(results);
        }
      })
      .catch((error) => {     res.status(500).json({ error: error.message }) })
};
