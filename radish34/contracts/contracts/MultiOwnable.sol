pragma solidity ^0.5.8;

contract MultiOwnable {
    mapping(address => bool) public isOwner;

    event SetOwner(address owner);

    modifier onlyOwner() {
        require(isOwner[msg.sender] == true, "Unauthorised access: needs to be called by an owner!");
        _;
    }

    /**
     * @dev constructor sets the initial owner
     */
    constructor() public {
        isOwner[msg.sender] = true;
    }

    /**
     * @dev Function to set owners addresses
	 * @notice change this to DAO like governence as this is too exploitable. Probably good enough for Radish34 for now
     */
    function setOwner(address owner) public {
        require(isOwner[msg.sender], "Unauthorised access: needs to be called by an owner!");
        isOwner[owner] = true;
        emit SetOwner(owner);
    }

}
