require("dotenv").config()
const { ethers } = require("hardhat");
const fs = require("fs");

// Replace with your contract address and ABI
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractJson = fs.readFileSync(
  "./artifacts/contracts/contract.sol/MyContract.json"
);
const contractABI = JSON.parse(contractJson).abi;
const networkName = "mumbai";
var provider;
var signer;
var contract;

// Create an instance of the contract

async function init() {
  provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/JCDtJ4AJCrVHMqyVsHl2_v_jenwuSFSn"
  );
  signer = await ethers.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);
}

function createNewUserFx(uid) {
  init().then(async ()=>{
    const createNewUserTx = await contract.createNewUser(uid);
    await createNewUserTx.wait();
  });
}

async function createNewAudioFileFx(uid){
  init().then(async ()=>{
    const createNewAudioFileTx = await contract.createNewAudioFile(uid);
    await createNewAudioFileTx.wait();
  });
  
}

async function getBalanceFx(uid) {
  await init();
  const bal=await contract.getBalance(uid);
  return bal;
}

async function evaluateYourselfFx(uid){
  init().then(async () => {
    const evaluateYourselfTx = await contract.evaluateYourself(uid);
    await evaluateYourselfTx.wait();
  });
}

module.exports = [createNewUserFx, createNewAudioFileFx, evaluateYourselfFx, getBalanceFx];