import { Router } from "express";
import { getAllMyTickets, createNewTicket, verifySession } from "../controllers/usersController.js"
import { logIn } from "../controllers/logInOutController.js"
import { verifyToken } from "../middleware/verifyToken.js"


const userRouter = Router();

userRouter.route("/login").post(logIn);//logInOutController
userRouter.route("/:id").get(verifyToken, getAllMyTickets).post(verifyToken, createNewTicket);
userRouter.get("/verify", verifyToken, verifySession);









export default userRouter;