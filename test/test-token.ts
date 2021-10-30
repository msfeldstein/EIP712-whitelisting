import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("Token", function () {
  let contract: Contract;
  let mintingKey: SignerWithAddress;
  let whitelistKey: SignerWithAddress;
  let maliciousKey: SignerWithAddress;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    mintingKey = accounts[0];
    whitelistKey = accounts[1];
    maliciousKey = accounts[2];

    const Token = await ethers.getContractFactory("NFT");
    contract = await Token.deploy();
    await contract.deployed();
  });

  it("Should allow minting with whitelist enabled if a valid signature is sent", async function () {
    await contract.setWhitelistSigningAddress(whitelistKey.address);
    let { chainId } = await ethers.provider.getNetwork();
    const domain = {
      name: "WhitelistToken",
      version: "1",
      chainId,
      verifyingContract: contract.address,
    }

    const types = {
      Minter: [
        {name: "wallet", type: "address"},  
      ]
    }
    
    const sig = await whitelistKey._signTypedData(domain, types, {wallet: mintingKey.address})
    await contract.whitelistMint(sig);
  });

  it("Should not allow minting with whitelist enabled if a different signature is sent", async function () {
    await contract.setWhitelistSigningAddress(whitelistKey.address);
    let { chainId } = await ethers.provider.getNetwork();
    const domain = {
      name: "WhitelistToken",
      version: "1",
      chainId,
      verifyingContract: contract.address,
    }

    const types = {
      Minter: [
        {name: "wallet", type: "address"},  
      ]
    }
    
    const sig = await maliciousKey._signTypedData(domain, types, {wallet: mintingKey.address})
    await expectRevert(contract.whitelistMint(sig), "Invalid Signature");
  });
});
