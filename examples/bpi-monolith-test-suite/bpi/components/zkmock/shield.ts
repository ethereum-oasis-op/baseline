import { Verifier } from "./verifier";

export class Shield {
    verifiers: { [id: string]: Verifier; } = {};
    agreementStateCommitment: Buffer;
    id: string;
    owner: string;

    constructor(id: string, initState: Buffer, owner: string) {
        this.id = id;
        this.agreementStateCommitment = initState;
        this.owner = owner
    }

    addVerifier(verifierId: string, verifier: Verifier, callingAddress: string) {
        if (callingAddress === this.owner) { // In practice contract would inherit from owned, calling address would be msg.sender
            this.verifiers[verifierId] = verifier;
        }
    }
    executeWorkstep(verifierId: string, stateObjectCommitment: Buffer, privateInputs: Object): any {
        let proof = privateInputs;
        let input = {
            agreementStateCommitment: this.agreementStateCommitment,
            stateObjectCommitment: stateObjectCommitment
        };
        this.agreementStateCommitment = this.verifiers[verifierId].verifyProof(proof, input);
        return true
    }

}
