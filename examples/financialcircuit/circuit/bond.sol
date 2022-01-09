
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
        Pairing.G1Point[13] IC;
    }

    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(uint256(9949031952981732093177494350187263314378795458010026631179073879407820074312), uint256(1373601886511459248972430739624915114816807541073068571033697870374971877773));
        vk.beta2 = Pairing.G2Point([uint256(17197705537686054176984558952698186761905362315791622177029098406305932953235), uint256(2567010860351283951635919982977593217095891465996664476000886701104723403836)], [uint256(18977365366471953297267249455044789054997290506725569408270895268651472930256), uint256(5224148015712688982443819570281155958699560957993325783152370579006999856627)]);
        vk.gamma2 = Pairing.G2Point([uint256(13588244497327296113684802323169055322969954256742526014345012069403413320557), uint256(14327705866135304589906144726350635331910516159789075092143084685748143839141)], [uint256(5690858394760937371620083694286656303094494014778938467183123655658440083005), uint256(1189482396809619335937838818248979912880778239773349548559615982355825163681)]);
        vk.delta2 = Pairing.G2Point([uint256(15334199098944042121810938150445183092271030992689719086500183402293194791957), uint256(6234355430362568382801848977644294518641526926149507555682118753381949033267)], [uint256(18259414400377481883768570120684326748721628190587594642905056255785375564371), uint256(9881358949808614999825379020021935108661542650639139395107998559819956490922)]);   
        vk.IC[0] = Pairing.G1Point(uint256(9223131175510561908363414137965844416553479815503522819665705280915134408307), uint256(20441445120348295431411718253245565497759575844145691472521271713484162312199));   
        vk.IC[1] = Pairing.G1Point(uint256(1710527098411580331425977605457787725641015204145495581960360729383106754034), uint256(15090610010588587708292964470496493578516188304405103116528763471080555923097));   
        vk.IC[2] = Pairing.G1Point(uint256(20059755745396282365981327466152349500159238177373808801794993816058907459384), uint256(11047822803736726878087866122300374196962322565472216156482458774716779071701));   
        vk.IC[3] = Pairing.G1Point(uint256(19510400642353937900661033549773408753966326542023665542331703496772577359974), uint256(359199510030972365030007456566785699009920243499004940827106132709976857754));   
        vk.IC[4] = Pairing.G1Point(uint256(15328620734509067805966815015904576446688747990297728226188733556968473579946), uint256(1298235157130705931765485038218174055008071738217988463447765329724541749055));   
        vk.IC[5] = Pairing.G1Point(uint256(18399741981045320006278166722050693936512834866426033634975322227325928186387), uint256(12203555470208765985844083666208777420521649348799395053270453992728944924404));   
        vk.IC[6] = Pairing.G1Point(uint256(19762929234480997503209649860860676591463221863808016038219795752871538513152), uint256(6193139680111138603159394978946095304943888855176469212807378926769346807665));   
        vk.IC[7] = Pairing.G1Point(uint256(2576913269996883686310626206926352484136182924907155479386781540043269394569), uint256(11503466688978344762594630375679396009190316784197156656972724602495534811593));   
        vk.IC[8] = Pairing.G1Point(uint256(260795585560547531342822853947618974935507842393012785530001772891397969801), uint256(12773854561727233703947456668005522455377099389553784960512996258195592282350));   
        vk.IC[9] = Pairing.G1Point(uint256(12897321115361835368827304745766521733223258615568746078517312352455918527567), uint256(1169307595905512321988703009290004828362354520938354985745928632844849567461));   
        vk.IC[10] = Pairing.G1Point(uint256(21365179685005299802805711406518415691898319207079524377328102221227506053465), uint256(19749130172017003255115555598649762436710930044320490579038852380136703895059));   
        vk.IC[11] = Pairing.G1Point(uint256(21456747581553981847270357857509901609523091597474641154428790126522098396412), uint256(7528787053178900443603738176143115321704552981335669666054797825732058853982));   
        vk.IC[12] = Pairing.G1Point(uint256(12710068682520321735077766159126174288245407853610917558703610490420392030770), uint256(4024526847466164164878631298224716180023375475511449829179057444173000381972));
    }
    
    /*
     * @returns Whether the proof is valid given the hardcoded verifying key
     *          above and the public inputs
     */
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[12] memory input
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
