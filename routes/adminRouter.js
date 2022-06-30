//Kunden Acounts erstellen -> signup (post)
//Kunden Accounts löschen - Aktualisieren
//Sich einlogen können
//Alle Tickets von allen Kunden sehen können
//Alle Tickets vcon allen Kunden uipdaten können
import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { getTicketsFromAllUsers, getCompanyInfos, getCompanyTickets, createNewUser, updateTicket, getAllCompanies, deleteUser, createNewCompany } from "../controllers/adminController.js"

const adminRouter = Router();
adminRouter.route("/login").post(logIn);//done checked -> success
adminRouter.route("/ticketsprocompany/:company_id").post(getCompanyTickets)//done Checked -> success
adminRouter.route("/ticketsprocompany/:company_id/:ticket_id").put(updateTicket)
adminRouter.route("/tickets").post(getTicketsFromAllUsers) //done Aber muss später wenn wir mehrere Tickets haben nochmal geprüft werden
adminRouter.route("/tickets/:ticket_id").put(updateTicket)
adminRouter.route("/companies").get(getAllCompanies)//done getAllCompanies -> success - deleteuser muss change to put(updateCompanyStatus) 
adminRouter.route("/companies/:company_id").post(getCompanyInfos).delete(deleteUser)
adminRouter.route("/companies/addnewcompany").post(createNewCompany) // done Check -> success
adminRouter.route("/users/addnewuser").post(createNewUser)//done checked -> success




export default adminRouter;