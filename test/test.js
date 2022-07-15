const { ethers, network } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { assert, expect } = require("chai");

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
      50,
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

  describe(" withdraw the amount", () => {
    it("Withdraw amount once called by lawyer", async () => {
      const t = await contract.earliest();
      await network.provider.send("evm_increaseTime", [51]);
      await network.provider.send("evm_mine", []);
      const contractBalanceBefore = await lawyer.provider.getBalance(
        contract.address
      );
      const benefeciarBalanceBefore = await benefeciary.provider.getBalance(
        benefeciary.address
      );
      await contract.withdraw();
      const contractBalanceAfter = await lawyer.provider.getBalance(
        contract.address
      );
      const benefeciarBalanceAfter = await benefeciary.provider.getBalance(
        benefeciary.address
      );
      assert.equal(
        contractBalanceBefore.toString(),
        ethers.utils.parseEther("1")
      );
      assert.equal(contractBalanceAfter.toString(), "0");
      assert.equal(
        benefeciarBalanceAfter.toString(),
        benefeciarBalanceBefore.add(ethers.utils.parseEther("1")).toString()
      );
    });

    it("Should not withdraw if the lawyer doesnt call withdraw", async () => {
      const beneficiaryContract = await contract.connect(benefeciary);
      await expect(beneficiaryContract.withdraw()).to.be.revertedWith(
        "Only lawyer allowed!"
      );
    });

    it("Should not withdraw before earliest time", async () => {
      await expect(contract.withdraw()).to.be.revertedWith(
        "Withdrawn too early :("
      );
    });
  });
});
