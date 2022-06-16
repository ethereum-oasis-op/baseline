import {
  deployShield,
  verifyAndAddNewLeaf,
  getProof,
} from "./blockchain/shieldUtils";

export class Shield {
  agreementStateCommitment;

  constructor(_agreementStateCommitment) {
    this.agreementStateCommitment = _agreementStateCommitment;
    deployShield();
  }

  async executeWorkstep(stateObjectCommitment: Buffer): Promise<any> {
    var proof = await getProof();
    var input = {
      agreementStateCommitment: this.agreementStateCommitment,
      stateObjectCommitment: stateObjectCommitment,
    };
    var executionStatus = verifyAndAddNewLeaf(
     proof,
      input,
      stateObjectCommitment
    );
    return executionStatus;
  }
}
