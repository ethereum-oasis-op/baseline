import axios from 'axios';
import { SRI_BACKEND } from '../constants';

const handleLogin = async () => {
  if (window.ethereum) {
    window.ethereum.enable();
    const mnemonic = await axios.get(`${SRI_BACKEND}/auth/mnemonic`);
    const accounts = await window.ethereum.send('eth_requestAccounts');
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [mnemonic.data, accounts.result[0]],
    });

    const input = {
      message: mnemonic.data,
      signature,
      publicKey: accounts.result[0],
    };

    const tokenRequest = await axios.post(`${SRI_BACKEND}/auth/login`, input);

    if (tokenRequest?.data?.access_token) {
      console.log(tokenRequest.data.access_token);
      localStorage.setItem('token', tokenRequest.data.access_token);
    } else {
      console.log('No token');
    }
  } else {
    throw new Error('No MM found. Please install Metamask');
  }
};

export default function Login() {
  return <button onClick={handleLogin}>Login</button>;
}
