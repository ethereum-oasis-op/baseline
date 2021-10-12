const signCommitment = async params => {
  const { payload } = params;
  const salt = '12345';
  // TODO: Hash the payload with the salt
  return {
    signedCommitment: 'SIGNEDCOMMITMENT123',
  };
};

export default signCommitment;
