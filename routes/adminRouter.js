//Kunden Acounts erstellen -> signup (post)
//Kunden Accounts löschen - Aktualisieren
//Sich einlogen können
//Alle Tickets von allen Kunden sehen können
//Alle Tickets vcon allen Kunden uipdaten können
import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { getTicketsFromAllUsers, getUserInfos, getCompanyTickets, deleteUserTicket, createNewUser, updateTicket, getAllUsers, deleteUser, updateUser } from "../controllers/adminController.js"

const adminRouter = Router();
adminRouter.route("/login").post(logIn);
adminRouter.route("/ticketsprocompany").get(getCompanyTickets).delete(deleteUserTicket).put(updateTicket)//in progress
adminRouter.route("/tickets").get(getTicketsFromAllUsers)
adminRouter.route("/users").get(getAllUsers).delete(deleteUser)//done
adminRouter.route("/users/addNewUser").post(createNewUser)//done 
adminRouter.route("/:username/infos").get(getUserInfos).put(updateUser)




export default adminRouter;