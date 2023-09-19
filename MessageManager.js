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

module.exports = {
    SendMessage
};