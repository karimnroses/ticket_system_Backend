import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { getTicketsFromAllUsers, getCompanyInfos, getCompanyTickets, createNewUser, updateTicket, getAllCompanies, updateCompanysStatus, createNewCompany } from "../controllers/adminController.js"

const adminRouter = Router();
adminRouter.route("/login").post(logIn);// success
adminRouter.route("/tickets/:company_id/:ticket_id").put(updateTicket) // success
adminRouter.route("/tickets/:orderBy/:ascOrDesc").get(getTicketsFromAllUsers) //done Aber muss später wenn wir mehrere Tickets haben nochmal geprüft werden - success
adminRouter.route("/companies").get(getAllCompanies).post(createNewCompany) // success
adminRouter.route("/:company_id/ticketsprocompany").get(getCompanyTickets)//  success
adminRouter.route("/:company_id").get(getCompanyInfos).put(updateCompanysStatus) //success
adminRouter.route("/adduser").post(createNewUser)//done checked -> success




export default adminRouter;