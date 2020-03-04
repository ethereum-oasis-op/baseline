pragma solidity ^0.5.8;


/**
 * @title Ownable
 * @dev This contract has the owner address providing basic authorization control
 */
contract Ownable {
  /**
   * @dev Event to show ownership has been transferred
   * @param previousOwner representing the address of the previous owner
   * @param newOwner representing the address of the new owner
   */
  event OwnershipTransferred(address previousOwner, address newOwner);

  // Owner of the contract
  address public _owner;

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner(), "You are not authorised to invoke this function");
    _;
  }

  /**
   * @dev The constructor sets the original owner of the contract to the sender account.
   */
  constructor() public {
    setOwner(msg.sender);
  }

  /**
   * @dev Tells the address of the owner
   * @return the address of the owner
   */
  function owner() public view returns (address) {
    return _owner;
  }

  /**
   * @dev Sets a new owner address
   */
  function setOwner(address newOwner) internal {
    _owner = newOwner;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner(), newOwner);
    setOwner(newOwner);
  }
}
