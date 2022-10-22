require("dotenv").config();

const express = require('express');
const hederaRouter = express.Router();
const bodyParser = require("body-parser");
hederaRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
hederaRouter.use(bodyParser.json());

var newCID = "";

const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar,
  ContractCreateFlow,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.HEDERA_ACC_ID);
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PVT_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function init() {
  // Import the compiled contract bytecode
  const contractBytecode = fs.readFileSync(
    "hedera/contract_sol_MyContract.bin"
  );

  // Instantiate the smart contract
  const contractInstantiateTx = new ContractCreateFlow()
    .setBytecode(contractBytecode)
    .setGas(100000)
    .setConstructorParameters();

  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(
    client
  );
  const newContractId = contractInstantiateRx.contractId;
  newCID = newContractId;
  console.log("The smart contract ID is " + newCID);
}
init();

async function createNewUser(uid) {
  // Calls a function of the smart contract
  const contractQuery = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(newCID)
    .setFunction(
      "createNewUser",
      new ContractFunctionParameters().addString(uid)
    )
    //Set the query payment for the node returning the request
    //This value must cover the cost of the request otherwise will fail
    .setQueryPayment(new Hbar(2));

  //Submit to a Hedera network
  const getMessage = await contractQuery.execute(client);

  // Get a string from the result at index 0
  const message = getMessage.getString(0);
  console.log("The contract message: " + message);
}

async function createNewAudioFile(uid) {
  const contractQuery = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(newCID)
    .setFunction(
      "createNewAudioFile",
      new ContractFunctionParameters().addString(uid)
    )
    .setQueryPayment(new Hbar(2));

  const getMessage = await contractQuery.execute(client);
  const message = getMessage.getString(0);
  console.log("The contract message: " + message);
}

async function getBalance(uid) {
  const contractQuery = await new ContractCallQuery()
    .setGas(100000)
    .setContractId(newCID)
    .setFunction(
      "getBalance",
      new ContractFunctionParameters().addString(uid)
    )
    .setQueryPayment(new Hbar(2));

  const getMessage = await contractQuery.execute(client);
  const message = getMessage.getString(0);
  console.log("The contract message: " + message);
}

hederaRouter.get("/getBalance", async (req, res)=>{
  const uid = req.query.userID;
  const balance = await getBalance(uid);
  res.send({
    "balance" : balance
  });
});

module.exports = {hederaRouter, createNewUser, createNewAudioFile, getBalance};
