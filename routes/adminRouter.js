//Kunden Acounts erstellen -> signup (post)
//Kunden Accounts löschen - Aktualisieren
//Sich einlogen können
//Alle Tickets von allen Kunden sehen können
//Alle Tickets vcon allen Kunden uipdaten können
import { logIn } from "../controllers/logInOutController.js"
import { Router } from "express";
import { getTicketsFromAllUsers, getUserInfos, getUserTickets, deleteUserTicket, createNewUser, updateTicket, getAllUsers, deleteUser, updateUser } from "../controllers/adminController.js"

const adminRouter = Router();
adminRouter.route("/login").post(logIn);
adminRouter.route("/:username/tickets").get(getUserTickets).delete(deleteUserTicket).put(updateTicket)
adminRouter.route("/tickets").get(getTicketsFromAllUsers)
adminRouter.route("/users").get(getAllUsers).delete(deleteUser)
adminRouter.route("/users/addNewUser").post(createNewUser)
adminRouter.route("/:username/infos").get(getUserInfos).put(updateUser)




export default adminRouter;