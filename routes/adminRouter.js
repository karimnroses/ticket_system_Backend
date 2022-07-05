import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js"
import { getTicketsFromAllUsers, getCompanyInfos, getCompanyTickets, createNewUser, updateTicket, getAllCompanies, updateCompanysStatus, createNewCompany, getAllUsers } from "../controllers/adminController.js"
import { verifySession } from "../controllers/adminController.js";

const adminRouter = Router();
adminRouter.route("/login").post(logIn);// success
adminRouter.route("/tickets/:company_id/:ticket_id").put(verifyToken, updateTicket) // success
adminRouter.route("/tickets/:orderBy/:ascOrDesc").get(verifyToken,  getTicketsFromAllUsers) //done Aber muss später wenn wir mehrere Tickets haben nochmal geprüft werden - success
adminRouter.route("/companies").get(verifyToken,  getAllCompanies).post(verifyToken,createNewCompany) // success
adminRouter.route("/:company_id/ticketsprocompany").get(verifyToken, getCompanyTickets)//  success
adminRouter.route("/:company_id").get(verifyToken, getCompanyInfos).put(verifyToken, updateCompanysStatus) //success
adminRouter.route("/adduser").post(verifyToken, createNewUser)//done checked -> success
adminRouter.route("/users/:orderBy/:ascOrDesc").get(verifyToken, getAllUsers)
adminRouter.get("/verify", verifyToken, verifySession);



export default adminRouter;