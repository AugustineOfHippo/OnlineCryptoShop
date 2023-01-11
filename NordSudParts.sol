// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract NordSudParts {
    address payable public owner;

    IERC20 public token;

    constructor(IERC20 _token){
        owner = payable(msg.sender);
        token = _token;
    }

    modifier onlyOwner {
        require(msg.sender == owner,"You are not the owner of this contract");
        _;
    }

    // All Parts Are Here
    // Part[] public allParts;
    mapping(uint256 => Part) public partsMap;
    mapping(address => User) public allUsers;
    mapping(address => Part[]) private purchases;

    // Global Part Id
    uint256 public partId = 0;

    // Delete Parts ID
    uint256[] public deletedParts;  

    // We need a Part Struct
    struct Part {
        uint256 id;
        string name;
        uint256 quantity;
        // string make;
        // string [] models;
        // string category;
        uint256 price;
    }
    
    // We need a User Struct
    struct User {
        address wallet;
        string email;
        string fullName;
        // string companyName;
        string phoneNumber;
    }

    // Create New User
    function createUser(string memory _email, string memory _fullName, string memory _phoneNumber) public {
            require(allUsers[msg.sender].wallet != msg.sender,"User already has an account");
            User memory newUser = User(msg.sender,_email,_fullName,_phoneNumber);
            allUsers[msg.sender] = newUser;
    }

    // User Can Edit His Info
    function editUser(string memory _email, string memory _fullName, string memory _phoneNumber) public {
                require(allUsers[msg.sender].wallet != msg.sender,"Not your account");
                allUsers[msg.sender].email = _email;
                allUsers[msg.sender].fullName = _fullName;
                allUsers[msg.sender].phoneNumber = _phoneNumber;
    }

    // User Can View His Purchases
    function viewPurchases() public view returns(Part[] memory) {
        return purchases[msg.sender];
    }

    function buyPart(uint256 _id, uint256 _quantity) public {
        require(token.balanceOf(msg.sender) >= partsMap[_id].price * _quantity,"Not Enough Fund");
        token.transferFrom( msg.sender, address(this), partsMap[_id].price * _quantity );
        purchases[msg.sender].push(partsMap[_id]);
        partsMap[_id].quantity -= 1;
    }

    // The owner can Add Parts
    function addPart(string memory _name, uint256 _quantity, uint256 _price) public onlyOwner {
        if(deletedParts.length > 0){
            Part memory newPart = Part(deletedParts[deletedParts.length - 1], _name, _quantity, _price);
            partsMap[deletedParts[deletedParts.length - 1]] = newPart;
            deletedParts.pop();
        } else {
            Part memory newPart = Part(partId, _name, _quantity, _price);
            partsMap[partId] = newPart;
            partId++;
        }
    }

    function getPartById(uint256 id) public view returns(Part memory){
        return partsMap[id];
    }
    
    // The owner can Edit Parts
    function editPart(uint256 _id,string memory _name, uint256 _quantity, uint256 _price) public onlyOwner {
        partsMap[_id].name = _name;
        partsMap[_id].quantity = _quantity;
        partsMap[_id].price = _price;
    }

    // The owner can Remove Parts
    function removePart(uint _id) public onlyOwner {
        partsMap[_id].name = "Empty";
        partsMap[_id].quantity = 0;
        partsMap[_id].price = 0;
        deletedParts.push(_id);
    }
    // The owner can see Orders
    // The owner can confirm Orders

}
