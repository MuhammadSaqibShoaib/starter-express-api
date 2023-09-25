const axios = require('axios')
const querystring = require('querystring')
const WebSocket = require('ws')


// This function will verify token we got from slack events api
async function EventHandler(req,res){
    const { challenge } = req.body;

    if(challenge){
        res.send(challenge)
    }
    else{
        try{
            const extractedData = {
                type: req.body.event.type,
                text: req.body.event.text,
                user: req.body.event.user,
                channel: req.body.event.channel,
              };
              const socket = new WebSocket("https://muhammadsaqibshoaib.github.io/UnityToSlack");
              socket.send(extractedData);
              console.log(extractedData);
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