const express = require('express')
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');
const bodyParser = require('body-parser')

const fs = require('fs')
//const key = fs.readFileSync("./key.pem")
//const cert = fs.readFileSync("./cert.pem")
const https = require('https');
const app = express()
app.use(cors());
app.use(bodyParser.json())
const WebSocket = require('ws')
//const server = https.createServer({key: key, cert: cert }, app)
const port = 3000

global.userRemoteAddress = ""
// slack data
const slackServerUrl = "https://slack.com/oauth/v2/authorize?scope=&user_scope=admin,channels:read,chat:write,groups:read,im:read,users.profile:read&redirect_uri=https://1.1.0.97:3001/&client_id=5845960045845.5842258443318\r\n"

app.get('/',(req,res) => {
       return res.send("Hello World!")
})
// app.get(/fromUnity)

// const wss = new WebSocket.Server({ port : 8080}, ()=>{
//     console.log("Server started")
// })


// wss.on('connection', function connection(ws) {
//     ws.on('open',()=>{
//         console.log("connected a client")
//         ws.send("client connected")
//     });
//     ws.on('message', (data) => {
//         let stringData = data.toString('utf-8')
//        console.log('data received \n %o',stringData)
       
//        ws.send(stringData);
//     });
//  })

//  wss.on('listening',()=>{
//     console.log('listening on 8080')
//  })
app.post('/', async (req, res) => { 
    console.log(req)
    const { code } = req.body;
       if(!code){
              return res.send("Hello!")
       }
    const ipAddress = req.socket.remoteAddress.replace('::ffff:', '');
  //res.send(code)
    try {
        if (code) {
            // Do something with the code, e.g., store it or process it
            //res.send(`Received code: ${code}`);
          
            // // Send the code to another URL via POST request
            const url = 'https://slack.com/api/oauth.v2.access';
        
            // Define the payload data as an object
            const payload = {
            code: code,
            client_id: '5845960045845.5842258443318',
            client_secret: '9b4ae13b60f7c66db1e640f44d7cf471',
            redirect_uri: 'https://muhammadsaqibshoaib.github.io/UnityToSlack/something.html'
            };
        
            // Convert the payload to x-www-form-urlencoded format
            const formData = querystring.stringify(payload);
        
            // Define the headers for the request
            const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
            };
        
            // Make the POST request using Axios
            axios.post(url, formData, { headers })
            .then((response) => {
                // Handle the response data here
                if(!response.data.ok){
                    console.log(response.data)
                    return res.status(401).json({ status: 401, message: "Authentication Failed", data: null})
                }
                // sending data to unity                
                return res.status(200).json({ status: 200, message: "Authenticated", data: response.data})
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error:', error);
                return res.status(401).json({ status: 402, message: "Authentication Failed", data: null})
            });
          }
          else {
            // Handle the case where the "code" parameter is missing
            return res.status(400).json({ status: 404, message: 'Missing "code" parameter in the request.', data: null});
          }
    } catch (error) {
        return res.status(error.statusCode).json({ status: 500, message: "Error Authenticating", data: null})
    }
 });



app.post('/getprofile',(req,res)=>{
    console.log("got a request")
    // Get the Authorization header from the request

    const code = req.body.code;
    console.log(code)
    const bearerToken = code;
    console.log("Token is : ",code)
    if(bearerToken){
        
        const config = {
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
            },
          };
          apiUrl = 'https://slack.com/api/users.profile.get'
          // Send the GET request
          axios.get(apiUrl, config)
            .then((response) => {
                const data = JSON.stringify(response.data)
              // Handle the response here
              console.log('Response:', response.data.profile.first_name);
              return res.send(response.data.profile.image_512)
            })
            .catch((error) => {
              // Handle any errors here
              console.error('Error:', error);
              return res.send("lanat hae bhai")
            });
            
    }
    else{
        return res.send("from else")
    }
})



app.listen(3000)
