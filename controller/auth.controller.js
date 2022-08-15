/*This file will contain the logic for the registration of the user and login of the user
 User : 1. Customer 
           -register and is approved by default
           -Should be able to login immeidiatly
        2. Engineer
           -Should be able to register 
           -Initially role will be in Pending state
           -Admin should be able to approve this
        3. Admin
           -Admin user should be only created from the backend... No api should be supported for it
*/

//Now logic for signup

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config')
const constant = require('../utils/constants');


exports.signup = async (req, res) => {
    
    if(req.body.userType != constant.userTypes.customer){
        req.body.userStatus = constant.userStatus.pending;
    };

    const userObj = {
        name : req.body.name,
        userId : req.body.userId,
        password : bcrypt.hashSync(req.body.password, 8),
        email : req.body.email,
        userType : req.body.userType,
        userStatus : req.body.userStatus
    };

    try{
        const userCreate = await User.create(userObj);

        const response = {
            name : userCreate.name,
            userId : userCreate.userId,
            email : userCreate.email,
            userType : userCreate.userType,
            userStatus : userCreate.userStatus,
            createdAt : userCreate.createdAt,
            updatedAt : userCreate.updatedAt
        }

        res.status(201).send(response);
    }catch(err){
        console.log("Some error happend",  err.message);
        res.status(500).send({
            message : "Some internal server error"
        })
    }
}


//Now logic for signin

exports.signin = async (req,res) => {

    try{
        //Check if the userId Passed is correct 
    const user = await User.findOne({userId : req.body.userId});
    if(user == null){
        return res.status(400).send({
            message : "Failed! UserId passed doesn't exist"
        });
    }


    //Check if user is in pending state

    if(user.userStatus == constant.userStatus.pending){
        return res.status(400).send({
            message:"Not yet approved from the admin"
        })
    }





    //Check if the password passed is correct
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if(!passwordIsValid){
        return res.status(401).send({
            message : "Wrong Password"
        });
    }

    //Create JWT token
    const token = jwt.sign({
        id: user.userId
    }, authConfig.secret , {
        expiresIn : 60000
    });
    
    //Send the successfull login response
    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus,
        accessToken : token
    });
    }catch(err){
        console.log("Internal error", err.message);
        res.status(500).send({
            message : "Some internal error while signin"
        });
    }
}
 