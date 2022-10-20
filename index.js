const express = require('express');
const app = express();
const authRouter = require("./routes/mongoose/Authentication");
const audioRouter = require("./routes/mongoose/Audio");

app.use(authRouter);
app.use(audioRouter);

app.get('/', (req, res)=>{
  res.send('Thanks for sending that request');
});

app.listen(3000, ()=>{
  console.log("Server started listening on port 3000");
});