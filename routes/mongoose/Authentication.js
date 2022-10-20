const express = require('express');
const router = express.Router;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/CodeStar", {
  useNewUrlParser: true,
  autoIndex: true
});

router.post("/addUser", async (req, res)=>{
  const userName = req.body.userName;
  const hashed = await bcrypt.hash(req.body.password, 7);

  const user = await User.findOne({userName});
  if (user) return res.send({
    "error": "A User with the given Username already exists"
  });

  const newUser = new User({"userName" : userName, "password": hashed});

  newUser.save().then(()=>{
    return res.send({
    "userID": newUser.id
    });
  }).catch((error)=>{
    console.log(error);
    return res.send({
      "error" : "Some Error Occured"
    });
  });
});

router.post("/login", async (req, res)=>{
  const userName = req.body.userName;
  const password = req.body.password;

  const user = await User.findOne({userName});
  if (!user) return res.send({
    "error": "No User exists with these credentials"
  });
  else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send({
    "error": "No User exists with these credentials"
  });;
  }
  res.send({
    "userID": user.id
  });
});

export default router;