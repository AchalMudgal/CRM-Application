//This is going to be the stsrting point of application

const express = require("express");
const app = express();

const serverConfig = require('./configs/server.config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./configs/db.config');
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');


//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



//Initialize the connection to the mongodb
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", ()=>{
    console.log("Error while connecting the server");
});
db.once("open", ()=>{
    console.log("Connected to the mongoDB");
    init();
});





//Create the ADMIN User at the Boot Time

async function init(){
   
    //Check if the admin user is already present
    try{ 
    
    await User.collection.drop();
    
    // let user =await User.findOne({userId:"admin"});

    // if(user){
    //     console.log("ADMIN user is already present");
    //     return;
    // }

    const user = await User.create({
        name: "Achal",
        userId : "admin",
        password:bcrypt.hashSync("achalMudgalBackendDeveloper", 8),
        email:"achalmudgalsince97@gmailcom",
        userType: "ADMIN"
    })

    console.log(user);
}catch(err){
    console.log('err in db initialization'+ err.message);
}  
};

//We need to connect router to the server

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/ticket.route')(app);



app.listen(serverConfig.PORT, ()=>{
    console.log("Server running sucessfully on port number :" , serverConfig.PORT);
}); 