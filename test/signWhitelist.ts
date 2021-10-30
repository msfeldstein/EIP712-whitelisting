import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";

export default async function signWhitelist(
  chainId: number,
  contractAddress: string,
  whitelistKey: SignerWithAddress,
  mintingAddress: string
) {
  // Domain data should match whats specified in the DOMAIN_SEPARATOR constructed in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L37-L47
  const domain = {
    name: "WhitelistToken",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  };

  // The types should match the TYPEHASH specified in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L25-L26
  const types = {
    Minter: [{ name: "wallet", type: "address" }],
  };

  const sig = await whitelistKey._signTypedData(domain, types, {
    wallet: mintingAddress,
  });

  return sig
}
