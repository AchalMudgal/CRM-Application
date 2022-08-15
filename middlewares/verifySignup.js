//logic to validate incoming req. body

const User = require('../models/user.model');
const constants = require("../utils/constants");

const validateSignUpRequestBody = async (req,res,next) => {

    //validate if name is present
    if(!req.body.name){
        return res.status(400).send({
            message : "Failed! User name is not provided"
        });
    }

    //validate if userId is present and if its not duplicate
    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed! UserId is not provided"
        });
    }

    try{
        const user = await User.findOne({userId : req.body.userId});
        if(user != null){
            return res.status(400).send({
                message : "Failed! UserId is already taken"
            })
        }
    }catch(err){
        return res.status(500).send({
            message : "Internal server error while validating the request"
        });
    }
    
    //validate if password is present or not
    if(!req.body.password){
        return res.status(400).send({
            message : "Failed! Password is not provided"
        });
    };
    //validate if email is present and if its not duplicate
    if(!req.body.email){
        return res.status(400).send({
            message : "Failed! Email is not provided"
        })
    }

    if(!isValidEmail(req.body.email)){
        return res.status(400).send({
            message: "Failed! Not a valid email id"
        });
    }
    //validate if userType is present and if its not duplicate
    if(!req.body.userType){
        return res.status(400).send({
            message : "Failed! User type is not passed"
        });
    }

    if(req.body.userType == constants.userTypes.admin){
        return res.status(400).send({
            message:"ADMIN registrationis not allowed"

        });
    }
    
    const userTypes = [constants.userTypes.customer,constants.userTypes.engineer];

    if(!userTypes.includes(req.body.userType)){
        return res.status(400).send({
            message: "UserType provided is not correct.Possible correct values : CUSTOMER | ENGINEER"
        });
    }

    next();// Give controll to the next middleware
};

const isValidEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}





const validateSignInRequestBody = (req,res,next) => {
    
    //Validate if the userId is present
    if(!req.body.userId){
        return res.status(400).send({
            message: "Failed! UserId is not provided"
        });
    }

    //Validate if password is present or not
    if(!req.body.password){
        return res.status(400).send({
            message:"Failed! Passsword is not provided"
        });
    }

    next();
}


const verifyRequestBodiesForAuth = {
    validateSignUpRequestBody : validateSignUpRequestBody,
    validateSignInRequestBody : validateSignInRequestBody
}

module.exports = verifyRequestBodiesForAuth;