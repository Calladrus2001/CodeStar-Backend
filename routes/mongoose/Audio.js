const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Audio = require("../../models/Audio");
const History = require("../../models/History");
const { createNewAudioFile } = require("../../hedera/contract");

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
  const user = await User.findById(userID);
  var audioID;
  if (!user) {
    console.log("User not found");
    return res.sendStatus(401);
  } else {
    const audiofile = await Audio.findOne({ userID: userID });
    if (!audiofile) {
      var audioFile = new Audio({
        userID: userID,
        audioDetails: [
          {
            name: name,
            downloadUrl: downloadUrl,
            time: time,
          },
        ],
      });
      audioFile
        .save()
        .then(() => {
          audioID = audioFile.id;
        })
        .catch((error) => {
          console.log(error + "line 51");
          return res.sendStatus(500);
        });
      try {
        await createNewAudioFile(user.id);
        await addNewExpense(name, "Expense", 50, user.id);
      } catch (e) {
        console.log(e.message + "line 58");
        return res.sendStatus(500);
      }
    } else {
      audiofile.audioDetails.push({
        name: name,
        downloadUrl: downloadUrl,
        time: time,
      });
      audiofile
        .save()
        .then(() => {
          audioID = audiofile.id;
        })
        .catch((e) => {
          console.log(e.message + "lin3 73");
          return res.sendStatus(500);
        });
      try {
        await createNewAudioFile(user.id);
        await addNewExpense(name, "Expense", 50, user.id);
      } catch (e) {
        console.log(e.message + "line 80");
        return res.sendStatus(500);
      }
    }
  }
  res.sendStatus(200);
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

async function addNewExpense(name, typeOf, amount, userID) {
  const amt = Number(amount);
  const historyInstance = await History.findOne({
    userID,
  });
  if (!historyInstance.details) {
    var newHistory = new History({
      "userID": userID,
      details: [
        {
          message: `Created new Audiobook: ${name}`,
          type: typeOf,
          time: Date.now().toLocaleString("en-us", {
            timeZone: "IST",
          }),
          cost: amt,
        },
      ],
    });
    newHistory.save();
  } else {
    historyInstance.details.push({
      message: `Created new Audiobook: ${name}`,
      type: typeOf,
      time: Date.now().toLocaleString("en-us", {
        timeZone: "IST",
      }),
      cost: amt,
    });
    historyInstance.save();
  }
}

module.exports = router;
