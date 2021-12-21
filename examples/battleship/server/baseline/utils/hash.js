const circomLib = require('circomlibjs')
const { utils } = require("ffjavascript");

async function hash(input) {
  const preImage = BigInt(input.shipX) + BigInt(input.shipY * 16) + BigInt(input.shipO * (16**2));
  const pedersenHash = await circomLib.buildPedersenHash()
  const buffer = utils.leInt2Buff(preImage, 32)
  const hash = pedersenHash.hash(buffer);
  const hP = pedersenHash.babyJub.unpackPoint(hash)
  return [utils.stringifyBigInts(pedersenHash.babyJub.F.toObject(hP[0])),utils.stringifyBigInts(pedersenHash.babyJub.F.toObject(hP[1]))];
}

module.exports = {
  hash
}