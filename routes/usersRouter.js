import { Router } from "express";
import { getAllMyTickets, createNewTicket, updateTicket, getMyInfos, updateMyContactData } from "../controllers/usersController.js"
import { logIn } from "../controllers/logInOutController.js"
import { verifyToken } from "../middleware/verifyToken.js"
import { verifySession } from "../controllers/usersController.js"

const userRouter = Router();

userRouter.route("/login").post(logIn);//logInOutController
userRouter.route("/:username/my-tickets").get(getAllMyTickets).post(createNewTicket).put(updateTicket);
userRouter.route("/:username/infos").get(getMyInfos).put(updateMyContactData);
userRouter.get("/verify", verifyToken, verifySession)










export default userRouter;