import * as gnarkwasm from "./gnarkwasm.remote";

const checkValidity = async () => {
    await gnarkwasm.checkValidity(
    {agreementStateCommitment: '1', 
    stateObjectCommitment: '1'}
) }

console.log(checkValidity());