const axios = require('axios')
const querystring = require('querystring')


// This function will verify token we got from slack events api
async function EventHandler(req,res){
    const { challenge } = req.body;

    if(challenge){
        res.send(challenge)
    }
    else{
        try{
            console.log(res.body)
            return res.send(200)
        }
        catch (error){
            console.log(error)
            return res.send(error)
        }
    }
}

module.exports = {
    EventHandler
};