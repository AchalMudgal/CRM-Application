//This file will have the logic to create controller for Ticket resource




const User = require('../models/user.model');
const constants = require('../utils/constants');
const Ticket = require('../models/ticket.model');
const sendNotification = require("../utils/notificationClient");


//Method to create the logic of creating tickets
   //1. Any authenticate user should be able to create the ticket
      //Miiddleware should take care of this
   //2.Ensure that request body has valid data
    //Middleware should take care of this 
   //3. After the ticket is created, ensure the customer and Engineer documents are also updated
   //4.Send the email after the ticket is created to all the stale holders
 
 
exports.createTicket = async (req,res) => {
  try{  
    //Read the req body and create the ticket
    const ticketObj = {
        title : req.body.title,
        ticketPriority : req.body.ticketPriority,
        description : req.body.description,
        status : req.body.status,
        reporter : req.userId //We'll get it from access token
    }



    //Find the Engineer available and attach to the ticket Object
    const engineer = await User.findOne({
        userType : constants.userTypes.engineer,
        userStatus : constants.userStatus.approved
    });

    if(engineer){
        ticketObj.assignee = engineer.userId;
    }
 
    //Insert the ticket Object
       //*Insert that ticket id in customer and engineer documents
    const ticketCreated = await Ticket.create(ticketObj);

    if(ticketCreated){
        //Update customer document
        const customer = await User.findOne({
            userId : req.userId
        });
        console.log(customer)
        customer.ticketsCreated.push(ticketCreated._id);
        await customer.save();
        
        //Update the Engineer document

        if(engineer){
            engineer.ticketsAssigned.push(ticketCreated._id);
            await engineer.save();
        }
        
        //Now we sholud send the notification request to notificationService
        
        sendNotification(`Ticket created with id ${ticketCreated._id}`, "ticket has been booked",`${customer.email},${engineer.email},achalmudgalsince97@gmail.com`, "CRM APP")


        res.status(201).send(ticketCreated);

    }

    }catch(err){
        console.log("Error while doing DB opreation", err.message);
        res.status(500).send({
            message : "Internal server error"
        })

    }       
}




exports.getAllTickets = async (req,res) => {
    //We need to find the userType and deprnding on the user
    //we need to frame the search query

    const user = await User.findOne({userId : req.userId});
    const queryObj = {};
    const ticketsCreated = user.ticketsCreated;// This is an array of ticket _id
    const ticketsAssigned = user.ticketsAssigned

    if(user.userType == constants.userTypes.customer){
        //Query fetching all the tickets created by the user

        

        if(!ticketsCreated){
            return res.status(200).send({
                message : "No tickets created by the user yet"
            });
        }

        queryObj["_id"] = { $in : ticketsCreated};

        console.log(queryObj);

    }else if(user.userType = constants.userTypes.engineer){
        //Query obj for all the tickets assigned/created to a user
        queryObj["$or"] = [{"_id" : {$in : ticketsCreated}}, {"_id" : {$in : ticketsAssigned}}];

        console.log(queryObj);
    }

    const tickets = await Ticket.find(queryObj);

    res.status(200).send(tickets)
}



exports.update = async (req,res) => {
    try{
        const ticket = await Ticket.findOne({"_id" : req.params.id});

        //Update ticket obj

        ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.status = req.body.status != undefined ? req.body.status : ticket.status;
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;

        const updatedTicket = await ticket.save();

        res.status(200).send(updatedTicket);
        
    }catch(err){
        console.log("Some error while updating ticket", err.message);
        res.status(500).send({
            message : "Some error while updating ticket"
        })
    }
}