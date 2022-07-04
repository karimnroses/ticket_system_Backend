import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js"
import { getTicketsFromAllUsers, getCompanyInfos, getCompanyTickets, createNewUser, updateTicket, getAllCompanies, updateCompanysStatus, createNewCompany } from "../controllers/adminController.js"
import { verifySession } from "../controllers/adminController.js";

const adminRouter = Router();
adminRouter.route("/login").post(logIn);// success
adminRouter.route("/tickets/:company_id/:ticket_id").put(verifyToken, verifySession, updateTicket) // success
adminRouter.route("/tickets/:orderBy/:ascOrDesc").get(verifyToken, verifySession, getTicketsFromAllUsers) //done Aber muss später wenn wir mehrere Tickets haben nochmal geprüft werden - success
adminRouter.route("/companies").get(verifyToken, verifySession, getAllCompanies).post(verifyToken,verifySession, createNewCompany) // success
adminRouter.route("/:company_id/ticketsprocompany").get(verifyToken,verifySession, getCompanyTickets)//  success
adminRouter.route("/:company_id").get(verifyToken, verifySession, getCompanyInfos).put(verifyToken, verifySession, updateCompanysStatus) //success
adminRouter.route("/adduser").post(verifyToken,verifySession, createNewUser)//done checked -> success
adminRouter.get("/verify", verifyToken, verifySession);



export default adminRouter;