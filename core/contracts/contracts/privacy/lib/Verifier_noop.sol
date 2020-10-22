// SPDX-License-Identifier: CC0
pragma solidity ^0.6.9;

/**
@title IVerifier
@dev Example Verifier Implementation
@notice Do not use this example in any production code!
*/
contract Verifier_noOp {

    function verify(
        uint256[] calldata _proof,
        uint256[] calldata _inputs
    ) external pure returns (bool result) {
        require(_proof[0] != 0, "Proof is undefined");
        require(_inputs[0] != 0, "Input is undefined");
        return true;
    }
    
}
