const express = require("express");
const { getAccessToken } = require("./spotify/auth")
const axios = require("axios")
const { searchTracks, getRecommendations } = require("./spotify/actions")

const app = express(); // initialize an express instance called 'app' 
const port = 3000;

app.use(express.json()); // set up the app to parse JSON request bodies

app.use(express.static("public"));

// return the public/index.html file when a GET request is made to the root path "/"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/recommendations", async (req, res) => { 

  if(!req.body) {
    return res.status(400).send({message: "Bad Request: Must provide body with artist and track"})
  }

  const { artist, track } = req.body

  if(!artist || !track) {
    return res.status(400).send({message: "Bad Request: Must provide body with artist and track"})
  }

  let accessToken

  try {
    accessToken = await getAccessToken()
  } catch(err) {
    console.error(err.message)
  }
  const http = axios.create({ headers: {
    "Authorization": `Bearer ${accessToken}`
  }})
  
  //get trackId
  let trackId

  try {
    const result = await searchTracks(http, { artist, track })
    trackId = result.tracks.items[0].id
   
  }catch (err) {
    return res.status(500).send({message: "Internal Error"})
  }

//get recommendations

try {
  const recommedations = await getRecommendations(http, { trackId })

  if (!recommedations.track.length) {
    return res.status(400).send({message: "No reccomdations found..."})
  }
  return res.send(recommedations)

  
 
}catch (err) {
  return res.status(500).send({message: "Internal Error: when getting track recommendations"})
}
})

// start listening on a port provided by Glitch
app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});

