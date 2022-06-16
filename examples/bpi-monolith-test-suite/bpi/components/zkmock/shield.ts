import { Verifier } from "./verifier";
import { getProof, verifyAndAddNewLeaf } from "./blockchain/shieldUtils";

export class Shield {
  verifiers: { [id: string]: Verifier } = {};
  agreementStateCommitment: Buffer;
  id: string;
  owner: string;

  constructor(id: string, initState: Buffer, owner: string) {
    this.id = id;
    this.agreementStateCommitment = initState;
    this.owner = owner;
  }

  addVerifier(verifierId: string, verifier: Verifier, callingAddress: string) {
    if (callingAddress === this.owner) {
      // In practice contract would inherit from owned, calling address would be msg.sender
      this.verifiers[verifierId] = verifier;
    }
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