pragma solidity ^0.5.8;

interface IRFQ {
    function placeRFQ(bytes32 hashEncnryptedObject, bytes32 encryptedObject) external returns (bool);
    function sendKey(bytes32 reencryptionKey, address _supplier) external returns (bool);
}
