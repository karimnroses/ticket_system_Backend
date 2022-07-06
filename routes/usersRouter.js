import { Router } from "express";
import { getAllMyTickets, createNewTicket, verifySession, getMyInfos, editeMyPassword } from "../controllers/usersController.js"
import { logIn } from "../controllers/logInOutController.js"
import { verifyToken } from "../middleware/verifyToken.js"


const userRouter = Router();

userRouter.route("/login").post(logIn);//logInOutController
userRouter.route("/postlogin/:id").get(verifyToken, getAllMyTickets).post(verifyToken, createNewTicket);
userRouter.route("/me/:user_id").get(verifyToken, getMyInfos)
userRouter.route("/me/edite-password").put(verifyToken, editeMyPassword)
userRouter.get("/verify", verifyToken, verifySession);









export default userRouter;