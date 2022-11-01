const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const History = require("../../models/History");
const {evaluateYourself} = require("../../hedera/contract");
const sentences = require('../../models/Evaluation');

router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());

router.post("/reading", (req, res)=>{
  const random = get3Random();
  const userID = req.body.userID;
  try {
    evaluateYourself(userID);
    addNewExpense("Reading", "Expense", 20, userID);
  }
  catch(e){
    console.log(e);
    return res.sendStatus(500);
  }
  return res.send({
    "sentences" : random
  });
});

function get3Random(){
  const arr = [];
  var flag = 0;
  for (i = 0; i < 3; i++){
    var idx = Math.floor(Math.random() * sentences.length);
    for (j = 0; j < arr.length; j++){
      if (sentences[idx] == arr[j]){
        i -= 1;
        flag = 1;
        break;
      }
    }
    if (flag == 0) arr.push(sentences[idx]);
    flag = 0;
  }
  return arr;
}

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