//This file should have the logic to connect to the notification service

const Client = require("node-rest-client").Client;

const client = new Client();//This is the client object which will be used for calling the REST APIs

//Exposing the method which takes the request parameters for sending the notification request to the notification service

module.exports = (subject, content, recepients, requester) => {

    //Create req body
    const reqBody = {
        subject : subject,
        recepientEmail : recepients,
        content : content,
        requester : requester
    }

    //Prepare the header
    const reqHeader = {
        "Content-Type" : "application/json"
    }

    // Combine header and req body together
    const args = {
        data : reqBody,
        headers : reqHeader
    }

    //Make a POST call and handle the res
    try{ 
        client.post("http://localhost:8000/notificationService/api/v1/notification", args, (data, res) =>{
            console.log("Request sent");
            console.log(data);
        })
    }catch(err){
        console.log(err.message);
    }    
}
