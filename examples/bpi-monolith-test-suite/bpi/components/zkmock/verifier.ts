
type input = {
    agreementStateCommitment: Buffer;
    stateObjectCommitment: Buffer;
}
type predicate = (
    input: input, 
    privateInput: object
    ) => Buffer;

export class Verifier{
    
    predicate: predicate;

    constructor(predicate: predicate){
        this.predicate = predicate;
    }

    verifyProof(proof: object, input: input): Buffer{
        return  this.predicate(input,proof)
    }
}