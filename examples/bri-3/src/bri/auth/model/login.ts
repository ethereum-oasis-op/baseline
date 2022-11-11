export interface Login {
  //bip39 string signed from Metamask
  message: string;

  signature: string;

  publicKey: string;
}
