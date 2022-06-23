import { Router } from "express";
import { getAllMyTickets, createNewTicket, updateTicket } from "../controllers/usersController.js";
import { logIn } from "../controllers/logInOutController.js"

const userRouter = Router();

userRouter.route("/login").post(logIn);
userRouter.route("/:username/my-tickets").get(getAllMyTickets).post(createNewTicket).put(updateTicket)










export default userRouter;