const express = require('express')
<<<<<<< Updated upstream
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)
=======
//const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser')
var Stream = require('stream').Transform;
// getting user data manager class
const userDataManager = require('./UserDataManager')
const ConversationManager = require('./ConversationManager')
const MessageManager = require('./MessageManager')
const EventManager =  require('./EventsManager')
const fs = require('fs')
const http = require('http');
const WebSocket = require('websocket').server
//const key = fs.readFileSync("./key.pem")
//const cert = fs.readFileSync("./cert.pem")
const https = require('https');
const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var FileReader = require('filereader')
//const server = https.createServer({key: key, cert: cert }, app)
const port = 3000

//const server12 = http.createServer(app)
//const httpsServer = https.createServer(app)

//let connectedSocket = null;

//const wss = new WebSocket.Server({ noServer: true });

let socket = null; // Variable to store the WebSocket instance

// Create a route to trigger WebSocket connection
// app.post('/connect-to-websocket', (req, res) => {
//   if (socket) {
//     res.status(200).send('Already connected to WebSocket.');
//   } else {
//     // Connect to the WebSocket server
//     socket = new WebSocket('ws://19ec-116-0-52-234.ngrok-free.app'); // Replace with your WebSocket server URL

//     socket.on('open', () => {
//       console.log('WebSocket connected.');
//       res.status(200).send('WebSocket connected successfully.');
//     });

//     socket.on('close', () => {
//       console.log('WebSocket disconnected.');
//       socket = null; // Reset the socket instance on disconnection
//     });
//   }
// });
const httpsServer = http.createServer(app)
const wss = new WebSocket({
  "httpServer" : httpsServer
})
// //const wss = new WebSocket.Server({ server: server12});

wss.on("request", request =>{
  socket = request.accept(null, request.origin)
  socket.on("open", () => console.log("OPENED!!"))
  socket.on("close", () => console.log("CLOSED!!"))
  socket.on("message", (message) => {
    console.log("Received message: ",message.utf8Data)
  })
 })
   
// wss.on('connection', (ws) => {
//   console.log('WebSocket connected.');
//   if(connectedSocket){
//     connectedSocket.close()
//   }
//   connectedSocket = ws;
//   // Event handler for receiving messages from WebSocket clients
//   ws.on('message', (message) => {
//     console.log(`Received message: ${message}`);
    

//     // Send a response back to the client
//     ws.send(`Server received: ${message}`);
//   });

//   // Event handler for WebSocket disconnections
//   ws.on('close', () => {
//     console.log('WebSocket disconnected.');
//   });
//   ws.on('error',(error)=>{
//     console.log(error)
//   });
// })


// app.get('/getSocket',(req,res)=>{
//      try{
//           wss.on('connection', (ws) => {
//             console.log('WebSocket connected.');
//             if(connectedSocket){
//               connectedSocket.close()
//             }
//             connectedSocket = ws;
//             // Event handler for receiving messages from WebSocket clients
//             ws.on('message', (message) => {
//               console.log(`Received message: ${message}`);
              

//               // Send a response back to the client
//               ws.send(`Server received: ${message}`);
//             });

//             // Event handler for WebSocket disconnections
//             ws.on('close', () => {
//               console.log('WebSocket disconnected.');
//             });
//             ws.on('error',(error)=>{
//               console.log(error)
//             });
//           });
//       return res.send(200)
// }
// catch(error){
//   console.log(error);
//   return res.send(error)
// }
// })
console.log('WebSocket server is running on port 3000');
    

app.get("/checksocket",(req,res)=>{
  try{
  console.log(wss)
  return res.send("OK")
  }
  catch(error){
    console.log(error)
    return res.send(error)
  }
})


app.post('/sendSocket',(req,res)=>{
  socket.send(req.body.data)
  return res.send(200)
})


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
app.post('/', userDataManager.Login)



app.post('/getprofile', userDataManager.GetProfile)

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
app.post('/getchannels', ConversationManager.GetChannels);
app.post('/download',userDataManager.getImageFromSlack);
app.post('/sendmessage',MessageManager.SendMessage);
app.post('/getMessages', MessageManager.GetMessages);
app.post("/events",EventManager.EventHandler);



//httpsServer.listen(3010)
//server.listen(port)
//server12.listen(3000)
httpsServer.listen(port, ()=>{
  console.log("My server is listening")
})
>>>>>>> Stashed changes
