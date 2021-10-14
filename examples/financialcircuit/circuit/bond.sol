
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
        vk.alfa1 = Pairing.G1Point(uint256(3869531497468377962581987445970458739300331142117836917443972959916446730775), uint256(13529444970946044779528607938315063992619556350682130819486798335922579276799));
        vk.beta2 = Pairing.G2Point([uint256(18709895715123951302351756047074406347951697564264517649475736120047442392398), uint256(626887175067805617578192962965108630753897366155463049140359163322234329691)], [uint256(14338142595445606173313013919990083794598249047934827486457481306571597034296), uint256(2976657162676043030220534063993282196352766037000868429646333496446473542976)]);
        vk.gamma2 = Pairing.G2Point([uint256(1008909068616458348664481851187487552304425517778588533320150090161310633861), uint256(12448999936891718007577108969237201302407466981322908265503654866646932995099)], [uint256(13553974266090760665791791570132398554674486723082608860606997949627647612445), uint256(7313626723990513520347433515860685226667717192488106505095501689553666324356)]);
        vk.delta2 = Pairing.G2Point([uint256(1108879461031927681143329434887229766555041926411524080360585176536328608332), uint256(12570906799421944124145269083381558429452030657856616229067461160531162648839)], [uint256(4669712275823192083334546276941958474885113107545777859625071381261607483366), uint256(9013072104535329590459440260318280918281301868972626308993495104475654440414)]);   
        vk.IC[0] = Pairing.G1Point(uint256(13112187816884083963298043789090851029296650793817691951344754183126497331355), uint256(178268587556463136378282879233373152702516251552519615968826273599145090752));   
        vk.IC[1] = Pairing.G1Point(uint256(6254396608126208995446900008872111883770794870677558610632931008659823768662), uint256(17228710457367688332973091281205816091002409758798361903397662997258231749386));   
        vk.IC[2] = Pairing.G1Point(uint256(12949275977842957235346680133802969999972807052310294478203593971778995295486), uint256(13228976486249811453991889698766440178493332822816137818629419658666327527663));   
        vk.IC[3] = Pairing.G1Point(uint256(16039862874437221352058256770944618368124494054475936971065331546180161950995), uint256(21595056589104235187566753708104377936327729307802738910363150206403971559365));   
        vk.IC[4] = Pairing.G1Point(uint256(2186285668760925229334548069504882187220985114814864853716351053709657756274), uint256(12889887779884649296566554745294061631556606032768475645544166035191206964064));   
        vk.IC[5] = Pairing.G1Point(uint256(2899521707402380894240476051976485947176391705012922651869022862398763699657), uint256(17964706815408589269681356031777587920761077441893305158711583440858511669550));   
        vk.IC[6] = Pairing.G1Point(uint256(11298072357361147365570522983933645388315010789178556949884522340659255765614), uint256(20814198630235604232647801102238866306081589836956001830062069034908992615371));   
        vk.IC[7] = Pairing.G1Point(uint256(16928665434758868307121614384619152472013351813670157382414078555199299569503), uint256(4208723407206762785255017218761138154858311401488412335721802122709489021541));   
        vk.IC[8] = Pairing.G1Point(uint256(3089453422786959613160530489953197310808464434135188175410589124376204653633), uint256(21446928348395387565592037384018660520858954333600376026875404351802889132765));   
        vk.IC[9] = Pairing.G1Point(uint256(20508255055206171937830921270977765259091901030910077278461267084125307251552), uint256(18667490210090226092409003983972515195404044575347808429865431364466892375570));   
        vk.IC[10] = Pairing.G1Point(uint256(10116789635362174821766301857924064734384184238319338111230370814422426180009), uint256(18212868078496298849972971573153540181266771328888746288094320465238397208573));   
        vk.IC[11] = Pairing.G1Point(uint256(17384610795597744161061604197208095060803678530605882175023356667391971611408), uint256(21643317032323005839089472678709841452628779012332349483079211547254262471395));   
        vk.IC[12] = Pairing.G1Point(uint256(731668400696578973343160024596349437217832067815357199308548559095137833572), uint256(9684297293272384985805209690560473139581128769597550177185438793780167103637));
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
