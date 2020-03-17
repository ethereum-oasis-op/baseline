import Wallet, { getBalance } from '../wallet';

console.log(Wallet);

const minBalance = 50;

export default async () => {
  const balance = await getBalance();
  if (balance > minBalance) {
    console.log('Wallet balance:', balance);
    return true;
  }
  console.log(
    `Not enough Eth in account! You need ${minBalance} but only have ${balance} available`,
  );
  return false;
};
