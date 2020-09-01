const axios = require('axios')

const express = require("express");
const app = express();


app.get("/", (request, response) => {
  response.status(200).send("OK");
});

setInterval(() => {
    axios.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
}); 