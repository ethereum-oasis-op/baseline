/**
CREDITS:

// For the Elliptic Curve Pairing operations and functions verify() and verifyCalculation():
// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// More information at https://gist.github.com/chriseth/f9be9d9391efc5beb9704255a8e2989d

Minor edits for Nightfall by:
Michael Connor
Duncan Westland
Chaitanya Konda
Harry R
*/

/**
@title Verifier
@dev Example Verifier Implementation - GM17 proof verification.
@notice Do not use this example in any production code!
*/

pragma solidity ^0.5.8;

//TODO: Use openzeppelin interfaces inside the timber service
import "./ERC165Compatible.sol";
import "./Pairing.sol";
import "./Registrar.sol";
import "./IVerifier.sol";
import "./Ownable.sol";

contract Verifier is Ownable, ERC165Compatible, Registrar, IVerifier {

    using Pairing for *;

    uint256 constant SNARK_SCALAR_BOUND = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant PRIME_BOUND = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    event Verified(bool verified);

    struct Proof_GM17 {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    struct Verification_Key_GM17 {
        Pairing.G2Point H;
        Pairing.G1Point Galpha;
        Pairing.G2Point Hbeta;
        Pairing.G1Point Ggamma;
        Pairing.G2Point Hgamma;
        Pairing.G1Point[] query;
    }

    Verification_Key_GM17 vk;

    constructor(address _erc1820) public ERC165Compatible() Registrar(_erc1820) {
        setInterfaces();
        setInterfaceImplementation("IVerifier", address(this));
    }

    function setInterfaces() public onlyOwner returns (bool) {
        supportedInterfaces[this.verify.selector] = true;
        return true;
    }

    function getInterfaces() external pure returns (bytes4) {
        return this.verify.selector;
    }

    function canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) external view returns(bytes32) {
        return ERC1820_ACCEPT_MAGIC;
    }

    function assignManager(address _newManager) onlyOwner external {
        assignManagement(_newManager);
    }

    function verify(
        uint256[] memory _proof,
        uint256[] memory _inputs,
        uint256[] memory _vk
    ) public returns (bool result) {
        if (verificationCalculation(_proof, _inputs, _vk) == 0) {
            result = true;
        } else {
            result = false;
        }
        emit Verified(result);
    }

    function verificationCalculation(
        uint256[] memory _proof,
        uint256[] memory _inputs,
        uint256[] memory _vk
    ) public returns (uint) {

        Proof_GM17 memory proof;
        Pairing.G1Point memory vk_dot_inputs;

        vk_dot_inputs = Pairing.G1Point(0, 0); //initialise

        proof.A = Pairing.G1Point(_proof[0], _proof[1]);
        proof.B = Pairing.G2Point([_proof[2], _proof[3]], [_proof[4], _proof[5]]);
        proof.C = Pairing.G1Point(_proof[6], _proof[7]);

        // Check whether proof values are each less than the prime bound
        require(proof.A.X < PRIME_BOUND, "Proof value aX greater than prime bound!");
        require(proof.A.Y < PRIME_BOUND, "Proof value aY greater than prime bound!");

        require(proof.B.X[0] < PRIME_BOUND, "Proof value bX0 greater than prime bound!");
        require(proof.B.Y[0] < PRIME_BOUND, "Proof value bY0 greater than prime bound!");

        require(proof.B.X[1] < PRIME_BOUND, "Proof value aY1 greater than prime bound!");
        require(proof.B.Y[1] < PRIME_BOUND, "Proof value bY1 greater than prime bound!");

        require(proof.C.X < PRIME_BOUND, "Proof value cX greater than prime bound!");
        require(proof.C.Y < PRIME_BOUND, "Proof value cY greater than prime bound!");

        vk.H = Pairing.G2Point([_vk[0], _vk[1]], [_vk[2], _vk[3]]);
        vk.Galpha = Pairing.G1Point(_vk[4], _vk[5]);
        vk.Hbeta = Pairing.G2Point([_vk[6], _vk[7]], [_vk[8], _vk[9]]);
        vk.Ggamma = Pairing.G1Point(_vk[10], _vk[11]);
        vk.Hgamma = Pairing.G2Point([_vk[12], _vk[13]], [_vk[14], _vk[15]]);

        vk.query.length = (_vk.length - 16)/2;
        uint j = 0;
        for (uint i = 16; i < _vk.length; i += 2) {
            vk.query[j++] = Pairing.G1Point(_vk[i], _vk[i+1]);
        }

        require(_inputs.length + 1 == vk.query.length, "Length of inputs[] or vk.query is incorrect!");

        // Check whether inputs are less than the snark field upper bound
        for (uint i = 0; i < _inputs.length; i++) {
            require(_inputs[i] < SNARK_SCALAR_BOUND, "Input greater than snark scalar field!");
            vk_dot_inputs = Pairing.addition(vk_dot_inputs, Pairing.scalar_mul(vk.query[i + 1], _inputs[i]));
        }

        vk_dot_inputs = Pairing.addition(vk_dot_inputs, vk.query[0]);

        /**
         * e(A*G^{alpha}, B*H^{beta}) = e(G^{alpha}, H^{beta}) * e(G^{psi}, H^{gamma})
         *                              * e(C, H)
         * where psi = \sum_{i=0}^l input_i pvk.query[i]
         */
        if (!Pairing.pairingProd4(vk.Galpha, vk.Hbeta, vk_dot_inputs, vk.Hgamma, proof.C, vk.H, Pairing.negate(Pairing.addition(proof.A, vk.Galpha)), Pairing.addition2(proof.B, vk.Hbeta))) {
            return 1;
        }

        /**
         * e(A, H^{gamma}) = e(G^{gamma}, B)
         */
        if (!Pairing.pairingProd2(proof.A, vk.Hgamma, Pairing.negate(vk.Ggamma), proof.B)) {
            return 2;
        }

        delete proof;
        delete vk.H;
        delete vk.Galpha;
        delete vk.Hbeta;
        delete vk.Ggamma;
        delete vk.Hgamma;
        delete vk.query;
        delete vk_dot_inputs;

        return 0;
    }
}
