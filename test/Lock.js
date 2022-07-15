const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Deed", () => {
  let contract, lawyer, benefeciary, earliestTime;
  beforeEach(async () => {
    [lawyer, benefeciary] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("Deed", lawyer);
    earliestTime = await time.latest();
    const args = [
      lawyer,
      benefeciary,
      earliestTime,
      ethers.utils.parseEther("1"),
    ];
    contract = await contractFactory.deploy(
      lawyer.address,
      benefeciary.address,

      ethers.utils.parseEther("1"),
      earliestTime,
      { value: ethers.utils.parseEther("1") }
    );
    await contract.deployTransaction.wait(1);
  });
  describe("Deploy Contract", () => {
    it("Should deploy the contract", async () => {
      const lawyerAddress = await contract.lawyer();
      const beneficiaryAddress = await contract.beneficiary();
      const amount = await contract.amount();
      const blockTimestamp = await time.latest();
      assert.equal(lawyerAddress, lawyer.address);
      assert.equal(beneficiaryAddress, benefeciary.address);
      assert.equal(ethers.utils.parseEther("1"), amount.toString());
      // assert.equal(earliestTime.toString(), earliest.toString());
    });
  });
});
