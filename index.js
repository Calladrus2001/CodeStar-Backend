const express = require('express');
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routes/mongoose/Authentication");
const historyRouter = require("./routes/mongoose/History");
const evalRouter = require("./routes/mongoose/Evaluation");
const pollyRouter = require("./routes/mongoose/T2S");

mongoose.connect("mongodb://127.0.0.1:27017/CodeStar", {
  useNewUrlParser: true,
  autoIndex: true,
}).then(()=>{
  console.log("Connected to MongoDB");
});

app.use(authRouter);
app.use(historyRouter);
app.use(evalRouter);
app.use(pollyRouter);

app.listen(3000, ()=>{
  console.log("Server started listening on port 3000");
});