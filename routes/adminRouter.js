//Kunden Acounts erstellen -> signup (post)
//Kunden Accounts löschen - Aktualisieren
//Sich einlogen können
//Alle Tickets von allen Kunden sehen können
//Alle Tickets vcon allen Kunden uipdaten können
import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { 
    getTicketsFromAllUsers, 
    getCompanyInfos, 
    getCompanyTickets, 
    createNewUser, 
    updateTicket, 
    getAllCompanies, 
    updateCompanysStatus,
    createNewCompany } 
    from "../controllers/adminController.js"

const adminRouter = Router();
adminRouter.route("/login").post(logIn);// success
adminRouter.route("/ticketsprocompany/:company_id").post(getCompanyTickets)//  success
adminRouter.route("/ticketsprocompany/:company_id/:ticket_id").put(updateTicket) // success
adminRouter.route("/tickets").post(getTicketsFromAllUsers) //done Aber muss später wenn wir mehrere Tickets haben nochmal geprüft werden - success
adminRouter.route("/tickets/:ticket_id").put(updateTicket) // success
adminRouter.route("/companies").get(getAllCompanies)//done getAllCompanies -> success - 
adminRouter.route("/companies/infos/:company_id").post(getCompanyInfos).put(updateCompanysStatus) //success
adminRouter.route("/companies/addnewcompany").post(createNewCompany) // done Check -> success
adminRouter.route("/users/addnewuser").post(createNewUser)//done checked -> success




export default adminRouter;