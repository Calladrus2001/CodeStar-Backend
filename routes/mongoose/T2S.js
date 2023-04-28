const t2sClient = require("../../models/t2sClient");
const t2sBucket = require("../../models/t2sBucket");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const Audio = require("../../models/Audio");
const History = require("../../models/History");
const [
  createNewUserFx,
  createNewAudioFileFx,
  evaluateYourselfFx,
  getBalanceFx,
] = require("../../scripts/contract");

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.post("/synthAudio", async (req, res) => {
  const userID = req.body.userID;
  const name = req.body.name;
  const time = req.body.time;
  const text = req.body.text;
  const file = t2sBucket.file(`${userID}/${name}`);

  const request = {
    input: { text: text },
    voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const writeStream = file.createWriteStream({
    resumable: false,
    metadata: {
      contentType: "audio/mpeg",
    },
  });

  t2sClient.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    // Write the synthesized audio content to the file in the bucket
    const audioContent = response.audioContent;
    writeStream.write(audioContent);
    writeStream.end();

    writeStream.on("finish", () => {
      console.log(
        `Audio file ${name}.mp3 has been written to bucket ${t2sBucket.name}`
      );
    });
  });

  const url = await file.getSignedUrl({
    action: "read",
    expires: "03-17-2099",
  }).then((val)=>{
    addAudio(userID, name, time, val[0]);
  });
  
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

async function addAudio(_userID, _name, _time, _url) {
  var audioID;
  const audiofile = await Audio.findOne({ userID: _userID });
  if (!audiofile) {
    var audioFile = new Audio({
      userID: _userID,
      audioDetails: [
        {
          name: _name,
          downloadUrl: _url,
          time: _time,
        },
      ],
    });
    audioFile
      .save()
      .then(() => {
        audioID = audioFile.id;
      })
      .catch((error) => {
        console.log(error + "line 99");
      });
    try {
      await createNewAudioFileFx(_userID);
      await addNewExpense(_name, "Expense", 50, _userID);
    } catch (e) {
      console.log(e.message + "line 105");
    }
  } else {
    audiofile.audioDetails.push({
      name: _name,
      downloadUrl: _url,
      time: _time,
    });
    audiofile
      .save()
      .then(() => {
        audioID = audiofile.id;
      })
      .catch((e) => {
        console.log(e.message);
      });
    try {
      await createNewAudioFileFx(_userID);
      await addNewExpense(_name, "Expense", 50, _userID);
    } catch (e) {
      console.log(e.message);
    }
  }
}

async function addNewExpense(name, typeOf, amount, userID) {
  const amt = Number(amount);
  const historyInstance = await History.findOne({
    userID,
  });
  if (!historyInstance) {
    var newHistory = new History({
      userID: userID,
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