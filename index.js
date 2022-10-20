const express = require('express');
const app = express();

app.get('/', (req, res)=>{
  res.send('Thanks for sending that request');
});

app.listen(3000, ()=>{
  console.log("Server started listening on port 3000");
});