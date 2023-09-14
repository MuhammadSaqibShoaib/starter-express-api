const express = require('express')
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');
const bodyParser = require('body-parser')
var Stream = require('stream').Transform;

const fs = require('fs')
const http = require('http');
//const key = fs.readFileSync("./key.pem")
//const cert = fs.readFileSync("./cert.pem")
const https = require('https');
const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const WebSocket = require('ws')
var FileReader = require('filereader')
//const server = https.createServer({key: key, cert: cert }, app)
const port = 3000

global.userRemoteAddress = ""
// slack data
const slackServerUrl = "https://slack.com/oauth/v2/authorize?scope=&user_scope=admin,channels:read,chat:write,groups:read,im:read,users.profile:read&redirect_uri=https://1.1.0.97:3001/&client_id=5845960045845.5842258443318\r\n"

app.get('/', (req, res) => {
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
    if (!code) {
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
                    if (!response.data.ok) {
                        console.log(response.data)
                        return res.status(401).json({ status: 401, message: "Authentication Failed", data: null })
                    }
                    // sending data to unity                
                    return res.status(200).json({ status: 200, message: "Authenticated", data: response.data })
                })
                .catch((error) => {
                    // Handle errors here
                    console.error('Error:', error);
                    return res.status(401).json({ status: 402, message: "Authentication Failed", data: null })
                });
        }
        else {
            // Handle the case where the "code" parameter is missing
            return res.status(400).json({ status: 404, message: 'Missing "code" parameter in the request.', data: null });
        }
    } catch (error) {
        return res.status(error.statusCode).json({ status: 500, message: "Error Authenticating", data: null })
    }
});



app.post('/getprofile', (req, res) => {
    console.log("got a request")
    // Get the Authorization header from the request

    const { code } = req.body;
    console.log(code)
    const bearerToken = code;
    console.log("Token is : ", code)
    if (bearerToken) {

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
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

                return res.send(response.data.profile.image_512)
            })
            .catch((error) => {
                // Handle any errors here
                console.error('Error:', error);
                return res.send("lanat hae bhai")
            });

    }
    else {
        return res.send("from else")
    }
})

// async (req, res) => {
//     try {
//         const uri = req.body.body


//         let config = {
//             method: 'get',
//             maxBodyLength: Infinity,
//             url: 'https://secure.gravatar.com/avatar/974fbf2fc917926e78d7cd7fe3e14bde.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-512.png',
//             headers: {}
//         };

//         let imageResp = await axios.request(config)
    
//         // const imageStream = await axios.get(decodeURIComponent(uri));
//         res.header('Access-Control-Allow-Origin', '*');
//         res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//         res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//         console.log(typeof(imageResp.data))
//         let buff= Buffer.from(imageResp.data)
//         // console.log(imageStream.data)
//         // const dataToSend = Buffer.from(imageStream.data).toString('base64')
//         // console.log(dataToSend)
        const mimeType = 'image/png'; // e.g., image/png
//         let dataToSend = buff.toString('base64')

//         res.send(`<img src="data:${mimeType};base64,${dataToSend}" />`);
//         // res.send()
//         // return res.send(dataToSend)
//         //return res.status(200).json({ data: imageStream.data });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ message: error.message });
//     }
// }
function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

const readImageFromStream = async (fetchRequestResultBody) => {
    const reader = fetchRequestResultBody.getReader();
  
    const stream = new ReadableStream({
      start(controller) {
        return pump();
        // The following function handles each data chunk
        function pump() {
          // "done" is a Boolean and value a "Uint8Array"
          return reader.read().then(({ done, value }) => {
            // If there is no more data to read
            if (done) {
              console.log("done", done);
              controller.close();
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);
            return pump();
          });
        }
      },
    });
  
    const response = new Response(stream);
    const blob = await response.blob();
    // const url = URL.createObjectURL(blob);
    const base64 = await blobToBase64(blob);
  
    return base64;
  };

app.post('/download',getImageFromSlack);


  
  
  
  


async function getImageFromSlack  (req,res){
    // let config = {
    //     method: 'get',
    //     maxBodyLength: Infinity,
    //     url: 'https://secure.gravatar.com/avatar/974fbf2fc917926e78d7cd7fe3e14bde.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-512.png',
    //     headers: {}
    // };

    // let imageResp = await axios.request(config)

    // const requestedData = await fetch(
    //     "https://secure.gravatar.com/avatar/974fbf2fc917926e78d7cd7fe3e14bde.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-512.png"
    //   );

    // let bs64 = await readImageFromStream(requestedData.body);
    const mimeType = 'image/png';
    let image = await axios.get('https://secure.gravatar.com/avatar/974fbf2fc917926e78d7cd7fe3e14bde.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-512.png', {responseType: 'arraybuffer'});
let returnedB64 = Buffer.from(image.data).toString('base64');


    // res.send(returnedB64)
    res.send(`<img src="data:${mimeType};base64,${returnedB64}" />`);
}



app.listen(3000)
