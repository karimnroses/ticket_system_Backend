import "dotenv/config.js";
import express from "express";
import cors from "cors"
import pool from "./db/pg.js";
import userRouter from './routes/usersRouter.js'

const app = express();
const port = process.env.PORT || 5000;

// const corsOptions = {
//     origin: process.env.REACT_APP_URI, // nur Zugriff von dieser Domain erlauben
//     exposedHeaders: "Authorization", //dem Frontend Zugriff auf die Header-Property "Authorization" geben
//   };

app.use(cors()); //corsOptions muss be added to cors( ... )!!!!
app.use(express.json());

app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.send("welcome to ticket system");
  });




app.listen(port, () => console.log(`Server running in port ${port}`));
