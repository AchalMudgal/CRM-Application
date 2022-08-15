//Route logic for ticket resource

const ticketController = require('../controller/ticket.controller')
const {authJwt, validateTicket} = require("../middlewares");


module.exports = (app) => {
    //Create ticket
    app.post("/crm/api/v1/tickets/",[authJwt.verifyToken] ,ticketController.createTicket)
    //Read ticket
    app.get("/crm/api/v1/tickets/", [authJwt.verifyToken] ,ticketController.getAllTickets);
    //Update ticket
    app.put("/crm/api/v1/tickets/:id",[authJwt.verifyToken, validateTicket.isValidOwnerOfTheTicket],ticketController.update)
}