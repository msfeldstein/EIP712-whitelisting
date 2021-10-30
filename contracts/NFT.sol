//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./EIP712Whitelisting.sol";

contract NFT is ERC721, EIP712Whitelisting {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("WhitelistToken", "TOKE") EIP712Whitelisting() {}

    // Use the requiresWhitelist modifier to reject the call if a valid signature is not provided
    function whitelistMint(bytes calldata signature)
        public
        requiresWhitelist(signature)
    {
        // Make sure to check other requirements before incrementing or minting
        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenIdCounter.current());
    }

    function tokenURI() public pure returns (string memory) {
        return
            "ipfs://bafybeiaqofrinid75krvga6c2alksixzmhuddx3zxgwvmyhh7vsyjbv6tm";
    }
}
