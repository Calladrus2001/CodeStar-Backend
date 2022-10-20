const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("../../models/User");
const { Audio } = require("../../models/Audio");

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/CodeStar", {
  useNewUrlParser: true,
  autoIndex: true,
});

router.get("/addAudio", async (req, res) => {
  const userID = req.params.userID;
  const name = req.body.name;
  const downloadUrl = req.body.downloadUrl;
  const user = await User.findById(userID);
  if (!user || !id) {
    console.log("User not found");
    return res.sendStatus(401);
  } else {
    const audio = await Audio.findOne({ userID });
    if (!audio) {
      var audioFile = new Audio({
        userID: userID,
        audioDetails: [
          {
            name: name,
            downloadUrl: downloadUrl,
          },
        ],
      });
      audioFile
        .save()
        .then(() => {
          return res.sendStatus(200);
        })
        .catch((error) => {
          console.log(error);
          return res.send({
            error: "Some Error Occured",
          });
        });
    } else {
      console.log(audio);
      // audio.audioDetails.push({
      //   "name" : name,
      //   "downloadUrl" : downloadUrl
      // });
    }
  }
});

module.exports = router;
