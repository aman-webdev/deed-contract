const { run } = require("hardhat");

const verify = async (address, args) => {
  run("verify:verify", {
    address,
    constructorArguments: args,
  });
};

module.exports = verify;
