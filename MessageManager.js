const axios = require('axios');
const { response } = require('express');
const querystring = require('querystring')

async function SendMessage(req,res){
    const {token} = req.body;
    const {channel} = req.body;
    const {text} = req.body;
    if(token && channel && text){
        try{
            // here trying to send message using the given data
            const url = "https://slack.com/api/chat.postMessage"

            const payload = {
                token : token,
                channel : channel,
                text : text
            };

            // converting 
            const formData = querystring.stringify(payload)
            // adding headers
            const headers = {
                'content-type' : 'application/x-www-form-urlencoded'
            };

            axios.post(url,formData,{headers})
                .then((response) =>{
                    //if(response.data.ok == "true"){
                        console.log(response.data.ok)
                        return res.send(response.data.ok)
                    //}
                    //else 
                })
                .catch((error) =>{
                    return res.send(error)
                })
        }
        catch(error){
            return res.send(error)
        }
    }
    else{
        return res.send("There are parameters missing")
    }
}

async function GetMessages(req,res){
    const { token  } = req.body;
    const { convid } = req.body;

    if(token && convid){
        try{
            try{
                // here trying to send message using the given data
                const url = "https://slack.com/api/conversations.history"
    
                const payload = {
                    token : token,
                    channel : convid
                };
    
                // converting 
                const formData = querystring.stringify(payload)
                // adding headers
                const headers = {
                    'content-type' : 'application/x-www-form-urlencoded'
                };
    
                axios.post(url,formData,{headers})
                    .then((response) =>{
                        //if(response.data.ok == "true"){
                            console.log(response.data.ok)
                            return res.send(response.data)
                        //}
                        //else 
                    })
                    .catch((error) =>{
                        return res.send(error)
                    })
            }
            catch(error){
                return res.send(error)
            }
        }
        catch(error){
            console.log("Got an error : ",error)
            return res.send(error)
        }
    }
    else{
        console.log("Missing arguments")
        return res.send("Arguments not found");
    }
}


async function GetChannels(req,res){
    const { token } = req.body;
    const { type } = req.type;
    console.log(typeof(type))
    return res.send(type)
}
module.exports = {
    SendMessage,
    GetMessages
};