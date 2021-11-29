// there is an issue in current snarkjs version with running fullProve function, described here https://github.com/iden3/snarkjs/issues/107
// this is also happening for our circuit at this time, but since circuit_js witness_calculator.js worked, wasm file should be fine
// using this solution that somebody proposed in comments there until snarkjs bug is fixed
// when this is fixed we should clean this up and replace with using groth16.fullProve function
const snarkjs = require('snarkjs')
const fs = require('fs')
const path = require('path');
const {utils} = require("ffjavascript");

const wc = require('./utils/witness_calculator.js')
const wasm = path.join(__dirname, 'circuit.wasm')
const zkey = path.join(__dirname, 'circuit_final.zkey')
const WITNESS_FILE =  '/tmp/witness'

const generateWitness = async (inputs) => {
  const buffer = fs.readFileSync(wasm);
  const witnessCalculator = await wc(buffer)
  const buff = await witnessCalculator.calculateWTNSBin(inputs, 0);
  fs.writeFileSync(WITNESS_FILE, buff)
}

const fullProve = async (inputSignals) => {
  await generateWitness(inputSignals)
  const { proof, publicSignals } = await snarkjs.groth16.prove(zkey, WITNESS_FILE);
  return { proof, publicSignals }
}

const getVerifyProofInputs = async(proof, publicSignals) => {
  let proofStr = utils.stringifyBigInts(proof);
  let publicSignalsStr = utils.stringifyBigInts(publicSignals);
  return {
    a: [proofStr.pi_a[0], proofStr.pi_a[1]],
    b: [[proofStr.pi_b[0][1], proofStr.pi_b[0][0]],
    [proofStr.pi_b[1][1], proofStr.pi_b[1][0]]],
    c:  [proofStr.pi_c[0], proofStr.pi_c[1]],
    public: publicSignalsStr
  }
}

module.exports = {
  fullProve,
  getVerifyProofInputs
}