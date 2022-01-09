
// SPDX-License-Identifier: AML
// 
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

// 2019 OKIMS

pragma solidity ^0.8.0;

library Pairing {

    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct G1Point {
        uint256 X;
        uint256 Y;
    }

    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint256[2] X;
        uint256[2] Y;
    }

    /*
     * @return The negation of p, i.e. p.plus(p.negate()) should be zero. 
     */
    function negate(G1Point memory p) internal pure returns (G1Point memory) {

        // The prime q in the base field F_q for G1
        if (p.X == 0 && p.Y == 0) {
            return G1Point(0, 0);
        } else {
            return G1Point(p.X, PRIME_Q - (p.Y % PRIME_Q));
        }
    }

    /*
     * @return The sum of two points of G1
     */
    function plus(
        G1Point memory p1,
        G1Point memory p2
    ) internal view returns (G1Point memory r) {

        uint256[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success,"pairing-add-failed");
    }

    /*
     * @return The product of a point on G1 and a scalar, i.e.
     *         p == p.scalar_mul(1) and p.plus(p) == p.scalar_mul(2) for all
     *         points p.
     */
    function scalar_mul(G1Point memory p, uint256 s) internal view returns (G1Point memory r) {

        uint256[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success,"pairing-mul-failed");
    }

    /* @return The result of computing the pairing check
     *         e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
     *         For example,
     *         pairing([P1(), P1().negate()], [P2(), P2()]) should return true.
     */
    function pairing(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2,
        G1Point memory d1,
        G2Point memory d2
    ) internal view returns (bool) {

        G1Point[4] memory p1 = [a1, b1, c1, d1];
        G2Point[4] memory p2 = [a2, b2, c2, d2];
        uint256 inputSize = 24;
        uint256[] memory input = new uint256[](inputSize);

        for (uint256 i = 0; i < 4; i++) {
            uint256 j = i * 6;
            input[j + 0] = p1[i].X;
            input[j + 1] = p1[i].Y;
            input[j + 2] = p2[i].X[0];
            input[j + 3] = p2[i].X[1];
            input[j + 4] = p2[i].Y[0];
            input[j + 5] = p2[i].Y[1];
        }

        uint256[1] memory out;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success,"pairing-opcode-failed");

        return out[0] != 0;
    }
}

contract Verifier {

    using Pairing for *;

    uint256 constant SNARK_SCALAR_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[12] IC;
    }

    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(uint256(1025726592885085955767847511135719962163048957049365209226837152640450675294), uint256(7309907188325013663389901646396260465136295130620170504484610704137682733230));
        vk.beta2 = Pairing.G2Point([uint256(9721004611466743170259912076843281687058993997675470573043892621402856326866), uint256(549146081144994643934976281351784962498757799796052249405265337336165061702)], [uint256(2084157952966433711987023189117447826422042976586108944016796669064670457470), uint256(11862326003428559313056662111914048064332438153025674985785655344802862020087)]);
        vk.gamma2 = Pairing.G2Point([uint256(336970607205392788116351212350442680554262188654839989618447378442945115631), uint256(19783757830890245900586499631792557836192261005220830226245952951023760371060)], [uint256(10352557026317947848697573622400928705527209644573013139320149892905399418358), uint256(20277362213603832282576380692810097164596602512212251227178831089165098100132)]);
        vk.delta2 = Pairing.G2Point([uint256(18285635562277398564554365719827698587584012940905787097491871113155218354298), uint256(5334958849483671234546357082840186277649894435362878470442700366515801789739)], [uint256(16049442454678802991218130985014507048797145637711981554482253999990102949040), uint256(136969863008460482973122644810191114678443446705893774610067294587654770245)]);   
        vk.IC[0] = Pairing.G1Point(uint256(9403693565753089580835975867647675113831236831641141284953954939564423665084), uint256(7914680256124709227032069524709121257895837195962277232009345124989251363463));   
        vk.IC[1] = Pairing.G1Point(uint256(4449434954901140469450930963414374280791884098086398107444077264788212921585), uint256(9216619702557158181562499657127353494413676315264022021193816676823283565485));   
        vk.IC[2] = Pairing.G1Point(uint256(14912525166536139526855965229880363660062683535842052636400178902342071706799), uint256(19991744701544940172273167555867312253638476403741608158356271147590097480568));   
        vk.IC[3] = Pairing.G1Point(uint256(739025670697166838389372703239622094115879266385774375289745696303899535971), uint256(16322134861599147178903358584990489429283622582917133177265743523790431055086));   
        vk.IC[4] = Pairing.G1Point(uint256(19382421527364533687051457682054852473958144590289695566640555351611756205259), uint256(17952391948982901913234774200294003876478183678576312252927395725529755386752));   
        vk.IC[5] = Pairing.G1Point(uint256(17074645044468448736741296296657062177878741389048701976665970244037186983932), uint256(19143279335940360358999145734102267226081173126282021128466930095421232248148));   
        vk.IC[6] = Pairing.G1Point(uint256(14446154395605766598004849790982570788894661258940090930851215079372794678479), uint256(16610348273778899160996810873940884593644522910884879819418752346430201552099));   
        vk.IC[7] = Pairing.G1Point(uint256(8028054456823611552565492908288328667346879693295608070062208834808543937347), uint256(20799125807186834803849893480866853015773078726561331798695065865221180931805));   
        vk.IC[8] = Pairing.G1Point(uint256(1633428768109709889355257087843155305554210234111835694024090736291282869322), uint256(1743337831339706671533139659528523970593335468043763278767711589053972623201));   
        vk.IC[9] = Pairing.G1Point(uint256(11852681811000208148664402231934270130534565332388949795290846999998828138204), uint256(19357499371302240348473440462701526532966470071521071130761520323900224602287));   
        vk.IC[10] = Pairing.G1Point(uint256(16795238829879471003586515448116336557351700440305790645412240752212471928178), uint256(15079778118988254945239915358018081784257051578525587599942672596103215719943));   
        vk.IC[11] = Pairing.G1Point(uint256(19127380319239630604518177912724079372236864656005053887702243838735000860539), uint256(21758017346518320840047521457679520801065007428900399276968259310131469851208));
    }
    
    /*
     * @returns Whether the proof is valid given the hardcoded verifying key
     *          above and the public inputs
     */
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[11] memory input
    ) public view returns (bool r) {

        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);

        VerifyingKey memory vk = verifyingKey();

        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);

        // Make sure that proof.A, B, and C are each less than the prime q
        require(proof.A.X < PRIME_Q, "verifier-aX-gte-prime-q");
        require(proof.A.Y < PRIME_Q, "verifier-aY-gte-prime-q");

        require(proof.B.X[0] < PRIME_Q, "verifier-bX0-gte-prime-q");
        require(proof.B.Y[0] < PRIME_Q, "verifier-bY0-gte-prime-q");

        require(proof.B.X[1] < PRIME_Q, "verifier-bX1-gte-prime-q");
        require(proof.B.Y[1] < PRIME_Q, "verifier-bY1-gte-prime-q");

        require(proof.C.X < PRIME_Q, "verifier-cX-gte-prime-q");
        require(proof.C.Y < PRIME_Q, "verifier-cY-gte-prime-q");

        // Make sure that every input is less than the snark scalar field
        for (uint256 i = 0; i < input.length; i++) {
            require(input[i] < SNARK_SCALAR_FIELD,"verifier-gte-snark-scalar-field");
            vk_x = Pairing.plus(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }

        vk_x = Pairing.plus(vk_x, vk.IC[0]);

        return Pairing.pairing(
            Pairing.negate(proof.A),
            proof.B,
            vk.alfa1,
            vk.beta2,
            vk_x,
            vk.gamma2,
            proof.C,
            vk.delta2
        );
    }
}
