//Kunden Acounts erstellen -> signup (post)
//Kunden Accounts löschen - Aktualisieren
//Sich einlogen können
//Alle Tickets von allen Kunden sehen können
//Alle Tickets vcon allen Kunden uipdaten können
import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { getTicketsFromAllUsers, getCompanyInfos, getCompanyTickets, createNewUser, updateTicket, getAllUsers, deleteUser, createNewCompany } from "../controllers/adminController.js"

const adminRouter = Router();
adminRouter.route("/login").post(logIn);//done
adminRouter.route("/ticketsprocompany").get(getCompanyTickets).put(updateTicket)//done
adminRouter.route("/tickets").get(getTicketsFromAllUsers) //done Aber muss später wenn wir mehrere Tickets haben nochmal geprüft werden
adminRouter.route("/users").get(getAllUsers).delete(deleteUser)//done
adminRouter.route("/users/addnewuser").post(createNewUser)//done 
adminRouter.route("/companies/addnewcompany").post(createNewCompany)
adminRouter.route("/company/infos").get(getCompanyInfos)




export default adminRouter;