const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const {get3Random} = require("../../models/Evaluation");
const History = require("../../models/History");
const {evaluateYourself} = require("../../hedera/contract");

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.post("/evaluation", (req, res)=>{
  const test = req.body.test;
  const userID = req.body.userID;
  try {
    evaluateYourself(userID);
    addNewExpense(test, "Expense", 20, userID);
  }
  catch(e){
    console.log(e);
    return res.sendStatus(500);
  }
  return res.sendStatus(200);
});

async function addNewExpense(test, typeOf, amount, userID) {
  const amt = Number(amount);
  const historyInstance = await History.findOne({
    userID,
  });
  if (!historyInstance) {
    var newHistory = new History({
      "userID": userID,
      details: [
        {
          message: `Attempted ${test} test`,
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
      message: `Attempted ${test} test`,
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