const axios = require('axios')
const querystring = require('querystring')


// This function will verify token we got from slack events api
async function verifyToken(req,res){
    const { challenge } = req.body;

    if(challenge){
        res.send(challenge)
    }
}

module.exports = {
    verifyToken
};