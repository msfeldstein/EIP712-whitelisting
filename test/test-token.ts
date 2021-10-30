import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import signWhitelist from "./signWhitelist";
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
    const sig = signWhitelist(chainId, contract.address, whitelistKey, mintingKey.address)
    await contract.whitelistMint(sig);
  });

  it("Should not allow minting with whitelist enabled if a different signature is sent", async function () {
    await contract.setWhitelistSigningAddress(whitelistKey.address);
    let { chainId } = await ethers.provider.getNetwork();
    const sig = signWhitelist(chainId, contract.address, maliciousKey, mintingKey.address)
    await expectRevert(contract.whitelistMint(sig), "Invalid Signature");
  });
});
