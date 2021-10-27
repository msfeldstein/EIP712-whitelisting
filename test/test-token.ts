import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
const {expectRevert} = require('@openzeppelin/test-helpers');

describe("Token", function () {
  let contract: Contract;
  let mintingKey: SignerWithAddress;
  let whitelistKey: SignerWithAddress;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    mintingKey = accounts[0];
    whitelistKey = accounts[1];

    const Token = await ethers.getContractFactory("NFT");
    contract = await Token.deploy();
    await contract.deployed();
  });

  it("Should allow minting if payable amount is right", async function () {
    await contract.mint({ value: ethers.utils.parseEther("0.1") });
    const balance = await contract.balanceOf(mintingKey.address);
    expect(balance).to.equal(1)
  });

  it("Should not allow minting if payable amount is too low", async function () {
    await expectRevert.unspecified(contract.mint({ value: ethers.utils.parseEther("0.01") }));
  });
});
