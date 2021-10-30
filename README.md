# Gas free whitelisting with EIP-712 signing


NFT launches may want to utilize some type of whitelist to make their launches more fair or appealing to their community and avoid gas wars and bots.  A few approaches one can take are:

- Writing whitelisted accounts into contract storage.  Super expensive to deploy but also dead simple
- Storing a merkle root to all the addresses that are whitelisted, and having the minter submit a merkle proof that their in that list.  This is much cheaper, but a bit arduous to add people to, especially once things are deployed (though possible). [[Needs citation]]
- This repos strategy: Signature verification using EIP-712.  No gas, simple for end users to get a signature created using a basic web2 web service.

## How's it work?
In order to prove that someone has been approved by the project we can have a whitelisting key owned by the project sign some structured data that includes the minting accounts address.  This can be done manually or with a web service that authenticates users somehow.

[EIP-712](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md) provides a scheme for encoding structs of data to be signed which is important so that we can recreate the exact same digest of data both client side, when generating the signature, and in the contract.  As long as the digest is exactly the same bytes, we can use solidity's `ecrecover` method to see which public key created the signature of the digest passed in.  If the signature was created by the whitelisting key, and the minting account is part of the signed data, we know that the minting account has been approved by the project.

## Examples

### [Signature Generation](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/test/signWhitelist.ts)

To generate the signature needed to mint, we can look at example code in [signWhitelist.ts](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/test/signWhitelist.ts).  We can see that we create whats called a [domain separator](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/test/signWhitelist.ts#L12-L17) which is used to make sure one contracts signature can't be replayed into another contract, or from testnet to mainnet.  We also create the [typehash](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/test/signWhitelist.ts#L21-L23) we use to describe how the data is structured.  All this data needs to exactly match what we use in the solidity contract.  We then use ethers' [signTypedData](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/test/signWhitelist.ts#L25-L27) function to sign the structured data and return the signature.

### [Signature Verification](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol)

I've created an [EIP712Whitelisting contract](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol) that you can inherit to get the [requiresWhitelist modifier](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L55) that you can use to protect public calls with a whitelisting requirement.  To enforce this we need to [recreate the exact digest that we expected to be signed](https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L59-L65) (essentially the domain separator described above and the address of the minting account), and then we can take the digest and the signature and use `ecrecover` to see what account created the signature, and make sure its the one we expect.

![It's free whitelisting meme](https://bafybeihiyttxdfaxd6blj32lzud6xgt2ba2xqsybui425m5vxqzxkcxcvi.ipfs.dweb.link/)