
pragma circom 2.0.0;
include "./node_modules/circomlib/circuits/pedersen.circom";
// simplified version of battleship circuit https://github.com/tommymsz006/zkbattleship-circuit/blob/master/circom/battleship_sha256.circom
// with only one ship, slightly adapted to work with latest version circom

template Battleship() {
  signal input shipX; // private input
  signal input shipY; // private input
  signal input shipO; // private input
  signal input shipHash[2];
  signal input targetX;
  signal input targetY;
  signal output out;

  signal isInRange;
  signal isHit;

  // hash check, calculate the hash and check if its same as input hash
  component hash = Pedersen(256);
  component n2b = Num2Bits(256);
  n2b.in <-- shipX + shipY * 16 + shipO * (16**2);
  for (var i = 0; i < 256; i++) {
    hash.in[i] <-- n2b.out[i];
  }
  shipHash[0] === hash.out[0];
  shipHash[1] === hash.out[1];

  // map check, just simple check if target coordinates are in 5x5 matrix range
  isInRange <-- (targetX >= 0 && targetX <= 4 && targetY >= 0 && targetY <= 4);
  isInRange === 1;

  // hit check, ship length is 4, and it is just checking based on orientation (0 and 1) if hit is in range of the ship
  // if orientation is 1, x coordinate of the ship is the same, and it is just checking if Y coordinate is between [Y, Y+3]
  // and vice versa for orientantion 0
  isHit <-- (shipO == 1 && targetX == shipX && targetY >= shipY && targetY < shipY + 3) || (shipO == 0 && targetY == shipY && targetX >= shipX && targetX < shipX + 3);

  out <== isHit;
}

component main {public [shipHash,targetX,targetY]} = Battleship();