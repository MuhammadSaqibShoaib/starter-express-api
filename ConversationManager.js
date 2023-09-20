const axios = require('axios');
const querystring = require('querystring')

async function GetChannels(req, res){
    const {token} = req.body;
    const { types } = req.body;
    console.log("Function is calling");
    //const typeArr = JSON.parse(types)
    //console.log(typeof(typeArr))
    
    //console.log(typeArr)
    console.log(token);
    try{
        if(types){
            // // Send the code to another URL via POST request
        const url = 'https://slack.com/api/conversations.list';
        console.log("url is: ",url)
        // Define the payload data as an object
        const payload = {
            token : token,
            types : types
        };
        console.log("Payload: ",payload)
        // Convert the payload to x-www-form-urlencoded format
        const formData = querystring.stringify(payload);
        console.log("Form data: ",typeof(formData))
        // Define the headers for the request
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        // Make the POST request using Axios
        axios.post(url, formData, { headers })
            .then((response) => {
                // Handle the response data here
                if (!response.data.ok) {
                    console.log(response.data)
                    return res.status(401).json({ status: 401, message: "Authentication Failed", data: null })
                }
                const channels = response.data.channels.map(channel => ({ id: channel.id }));
                console.log(channels)

                // sending data to unity                
                return res.send(channels)
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error:', error);
                return res.status(401).json({ status: 402, message: "Authentication Failed", data: null })
            });
        }
        else{
            return res.send("No token found");
        }
    }
    catch(error){
        return res.send(error);
    }
} 

module.exports = {
    GetChannels
}