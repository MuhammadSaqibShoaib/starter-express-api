const axios = require('axios')
app.use(bodyParser.json())
async function Login(req,res){
    //console.log(req.body.code)
    const { code } = req.body;
    console.log("code is: ",code)
    if (!code) {
        return res.send("Hello!")
    }
    //const ipAddress = req.socket.remoteAddress.replace('::ffff:', '');
    //res.send(code)
    try {
        if (code !=null) {
            // Do something with the code, e.g., store it or process it
            //res.send(`Received code: ${code}`);

            // // Send the code to another URL via POST request
            const url = 'https://slack.com/api/oauth.v2.access';
            console.log("url is: ",url)
            // Define the payload data as an object
            const payload = {
                code: code,
                client_id: '5845960045845.5842258443318',
                client_secret: '9b4ae13b60f7c66db1e640f44d7cf471',
                redirect_uri: 'https://muhammadsaqibshoaib.github.io/UnityToSlack/something.html'
            };

            // Convert the payload to x-www-form-urlencoded format
            const formData = querystring.stringify(payload);
            console.log("Form data: ",formData)
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
}

async function GetProfile(req,res){
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
                const user = {
                    realName: response.data.profile.real_name,
                    imageURL: response.data.profile.image_192,
                    phoneNumber: response.data.profile.phone,
                    email: response.data.profile.email
                }
                console.log(user)
                return res.send(user)
            })
            .catch((error) => {
                // Handle any errors here
                console.error('Error:', error);
                return res.send("Error in fethcing user profile")
            });

    }
    else {
        return res.send("from else")
    }
}


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
    const imageURL = req.body.imageURL
    let image = await axios.get(imageURL, {responseType: 'arraybuffer'});
let returnedB64 = Buffer.from(image.data).toString('base64');


    // res.send(returnedB64)
    res.send(returnedB64);
}

module.exports = {
    Login,
    GetProfile,
    getImageFromSlack
}