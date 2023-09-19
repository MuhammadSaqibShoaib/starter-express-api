const express = require('express')
//const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser')
var Stream = require('stream').Transform;
// getting user data manager class
const userDataManager = require('./UserDataManager')
const ConversationManager = require('./ConversationManager')
const MessageManager = require('./MessageManager')
const fs = require('fs')
const http = require('http');
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
app.post('/sendmessage',MessageManager.SendMessage)

  
  
  
  





app.listen(3000)
