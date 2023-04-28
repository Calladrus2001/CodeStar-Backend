const mongoose = require("mongoose");
const History = require("../../models/History");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
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

router.get("/getHistory", async (req, res) => {
  const userID = req.query.userID;
  const historyInstance = await History.findOne({
    userID,
  });
  if (!historyInstance) {
    console.log("No Expense History found");
    return res.status(200).send({
      message: "No Expense History found",
    });
  } else {
    res.send({
      History: historyInstance.details,
    });
  }
});

router.get("/getBalance", async (req, res) => {
  const userID = req.query.userID;
  const balance = await getBalanceFx(userID);
  res.status(200).send({
    "balance" : parseInt(balance, 10)
  });
})

module.exports = router;
