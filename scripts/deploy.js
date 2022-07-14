const { ethers, run, network } = require("hardhat");
const verify = require("./verify");

const deploy = async () => {
  const [lawyer, beneficier] = await ethers.getSigners();
  const args = [
    lawyer.address,
    beneficier.address,
    ethers.utils.parseEther("0.01"),
    1657822331,
  ];
  console.log(lawyer.address, beneficier.address);

  const contractFactory = await ethers.getContractFactory("Deed", lawyer);

  const contract = await contractFactory.deploy(
    lawyer.address,
    beneficier.address,
    ethers.utils.parseEther("0.01"),
    1657822331,
    {
      value: ethers.utils.parseEther("0.01"),
    }
  );
  // await contract.deployed();
  await contract.deployTransaction.wait(6);

  console.log(contract.address);
  if (network.config.chainId === 4) {
    verify(contract.address, args);
  }
};

deploy();
