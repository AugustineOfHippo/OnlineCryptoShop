// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NordSudToken is ERC20 {

        address payable owner;
        constructor() ERC20("NordSudToken","NST") {
            owner = payable(msg.sender);
            _mint(owner,100000000 * (10**18) );
        }
    
}
