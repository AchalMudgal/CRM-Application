const mongoose = require('mongoose');
const constants = require('../utils/constants');

const ticketSchema = new mongoose.Schema({

    title : {
        type: String,
        required : true
    },
    ticketPriority : {
        type: Number,
        required : true,
        default: 4
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : constants.ticketStatuses.open,
        enum : [constants.ticketStatuses.open, constants.ticketStatuses.closed, constants.ticketStatuses.blocked]
    },
    reporter : {
        type : String,
        required : true
    },
    assignee : {
        type : String
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : ()=>{
            return Date.now()
        }
    },
    updatedAt : {
        type : Date,
        default : ()=>{
            return Date.now();
        }
    }
}, {versionKey:false})//This will ensure _v is not created by mongoose 

module.exports = mongoose.model("Ticket", ticketSchema);