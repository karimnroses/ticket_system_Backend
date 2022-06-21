import { Router } from "express";
import { logIn } from "../controllers/usersController.js";

const userRouter = Router();

userRouter.get("/login", logIn);




export default userRouter;