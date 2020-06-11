pragma solidity ^0.5.8;
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";

contract ERC165Compatible is ERC165 {
    mapping (bytes4 => bool) supportedInterfaces;

    constructor() public {
        setInterfaces();
    }

    function setInterfaces() public returns (bool) {
        supportedInterfaces[this.supportsInterface.selector] = true;
    }

    /// @notice Query if a contract implements an interface
    /// @param interfaceID The interface identifier, as specified in ERC-165
    /// @dev Interface identification is specified in ERC-165. This function
    ///  uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceID` and
    ///  `interfaceID` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceID) external view returns (bool){
        return supportedInterfaces[interfaceID];
    }
}
