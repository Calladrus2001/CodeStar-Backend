async function main() {
  const MyContract = await ethers.getContractFactory("MyContract");

  // Start deployment, returning a promise that resolves to a contract object
  const my_contract = await MyContract.deploy();
  console.log("Contract deployed to address:", my_contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
