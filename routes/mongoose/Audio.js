const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Audio = require("../../models/Audio");

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

router.post("/addAudio", async (req, res) => {
  const userID = req.body.userID;
  const name = req.body.name;
  const downloadUrl = req.body.downloadUrl;
  const time = req.body.time;
  const user = await User.findOne({ userID });
  if (!user) {
    console.log("User not found");
    return res.sendStatus(401);
  } else {
    const audiofile = await Audio.findOne({ userID });
    if (!audiofile) {
      var audioFile = new Audio({
        userID: userID,
        audioDetails: [
          {
            name: name,
            downloadUrl: downloadUrl,
            time: time
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
      audiofile.audioDetails.push({
        name: name,
        downloadUrl: downloadUrl,
        time: time
      });
      audiofile
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
    }
  }
});

router.get("/getAudio", async (req, res) => {
  const userID = req.query.userID;
  const audiofiles = await Audio.findOne({ userID });
  if (!audiofiles)
    return res.send({
      message: "No files found",
    });
  else {
    res.send({
      audioFiles: audiofiles.audioDetails,
    });
  }
});
module.exports = router;
