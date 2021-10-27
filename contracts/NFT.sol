//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721 {
    using Counters for Counters.Counter;
    using Strings for uint256;

    uint constant MINT_PRICE = 0.1 ether;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("AllowListToken", "TOKE") {
    }

    function mint() public payable {
        require(msg.value == MINT_PRICE);
        _tokenIdCounter.increment();
        _safeMint(msg.sender, _tokenIdCounter.current());
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://whatever/";
    }
}
