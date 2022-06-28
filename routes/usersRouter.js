import { Router } from "express";
import { getAllMyTickets, createNewTicket } from "../controllers/usersController.js"
import { logIn } from "../controllers/logInOutController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { verifySession } from "../controllers/usersController.js"

const userRouter = Router();

userRouter.route("/login").post(logIn);//logInOutController
userRouter.route("/:username/my-tickets").get(getAllMyTickets).post(createNewTicket);
userRouter.get("/verify", verifyToken, verifySession)










export default userRouter;