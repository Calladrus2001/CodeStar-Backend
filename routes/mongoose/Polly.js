const {StartSpeechSynthesisTaskCommand} = require("@aws-sdk/client-polly");
const pollyClient = require("../../models/pollyClient");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

var params = {
  Engine: "standard",
  // LanguageCode: hindi
  LanguageCode: "en-US",
  OutputFormat: "mp3",
  OutputS3BucketName: "vishesh-code-star",
  SampleRate: "22050",
  Text: "This will be replaced by text in the request body",
  TextType: "text",
  VoiceId: "Joanna",
};

mongoose.connect("mongodb://127.0.0.1:27017/CodeStar", {
  useNewUrlParser: true,
  autoIndex: true,
});

router.post("/synthAudio", async (req, res) => {
  // params.OutputS3BucketName = `vishesh-code-star/${req.body.userID}`;
  params.Text = req.body.text;
  console.log(params.Text);

  await pollyClient
    .send(new StartSpeechSynthesisTaskCommand(params))
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });

  res.sendStatus(200);
});

module.exports = router;
