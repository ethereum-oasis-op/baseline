import {
  deployShield,
  verifyAndAddNewLeaf,
  getProof,
} from "./blockchain/shieldUtils.js";

export class Shield {
  agreementStateCommitment;

  constructor(_agreementStateCommitment) {
    this.agreementStateCommitment = _agreementStateCommitment;
    deployShield();
  }

  executeWorkstep(stateObjectCommitment: Buffer): any {
    var proof = getProof();
    var a = proof["Ar"];
    var b = proof["Bs"];
    var c = proof["Krs"];
    var input = {
      agreementStateCommitment: this.agreementStateCommitment,
      stateObjectCommitment: stateObjectCommitment,
    };
    var executionStatus = verifyAndAddNewLeaf(
      a,
      b,
      c,
      input,
      stateObjectCommitment
    );
    return executionStatus;
  }
}
