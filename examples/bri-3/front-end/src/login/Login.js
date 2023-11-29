import axios from 'axios';
import { React, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Button } from 'react-bootstrap';

export default function Login() {
  const [data, setData] = useState({
    publicKey: '',
  });

  const handleLogin = async () => {
    try {
      // TODO: handle situations like account switch in metamask or when wallet is initially locked
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        const nonceDto = {
          publicKey: accounts[0],
        };
        console.log('nonceDto', nonceDto);
        const nonce = await axios.post(
          `${process.env.REACT_APP_SRI_BACKEND}/auth/nonce`,
          nonceDto,
        );

        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [nonce.data, accounts[0]],
        });

        const loginDto = {
          message: nonce.data,
          signature,
          publicKey: accounts[0],
        };

        const tokenRequest = await axios.post(
          `${process.env.REACT_APP_SRI_BACKEND}/auth/login`,
          loginDto,
        );

        if (tokenRequest?.data?.access_token) {
          const publicKey = accounts[0];
          setData({ publicKey });
          console.log(tokenRequest.data.access_token);
          toast.success('Success!');
        } else {
          toast.error('No token.');
        }
      } else {
        throw new Error('No MM found. Please install Metamask');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <p>Welcome back 🎉 !</p> <br />
      <Button data-testid="login" onClick={handleLogin}>
        Login
      </Button>{' '}
      <br />
      <Card
        style={{
          textAlign: 'left',
          width: '50rem',
          fontSize: 16,
          color: 'white',
          backgroundColor: 'transparent',
          border: 'transparent',
          padding: '10px',
        }}
      >
        {data.publicKey && (
          <Card.Text>
            <b>Current Public Key: </b>
            {data.publicKey}
          </Card.Text>
        )}
      </Card>
    </>
  );
}
