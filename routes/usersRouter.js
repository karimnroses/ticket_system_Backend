import { Router } from "express";
import { getAllUsers } from "../controllers/usersController.js";

const userRouter = Router();

userRouter.route("/").get(getAllUsers);




export default userRouter;