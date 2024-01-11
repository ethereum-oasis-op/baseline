import axios from 'axios';
import { React, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { keccak256 } from '@ethersproject/keccak256';
import * as circomlib from 'circomlibjs';

export default function Login() {
  const [data, setData] = useState({
    publicKey: {
      ecdsa: '',
      eddsa: '',
    },
  });

  const handleLogin = async () => {
    try {
      // TODO: handle situations like account switch in metamask or when wallet is initially locked
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const nonceDto = {
          ecdsaPublicKey: accounts[0],
        };
        const nonce = await axios.post(
          `${process.env.REACT_APP_SRI_BACKEND}/auth/nonce`,
          nonceDto,
        );
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [nonce.data, accounts[0]],
        });

        const eddsaPrivateKey = createEddsaPrivateKey(accounts[0]);

        const eddsaPublicKey = createEddsaPublicKey(eddsaPrivateKey);

        const loginDto = {
          message: nonce.data,
          signature,
          publicKey: {
            ecdsa: accounts[0],
            eddsa: eddsaPublicKey,
          },
        };

        const tokenRequest = await axios.post(
          `${process.env.REACT_APP_SRI_BACKEND}/auth/login`,
          loginDto,
        );

        if (tokenRequest?.data?.access_token) {
          const ecdsaPublicKey = accounts[0];
          setData({
            publicKey: {
              ecdsa: ecdsaPublicKey,
              eddsa: eddsaPublicKey,
            },
          });
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

  const createEddsaPrivateKey = async (publicKeyOwner) => {
    const message = keccak256(publicKeyOwner);

    const eddsaPrivateKey = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, publicKeyOwner],
    });

    return eddsaPrivateKey;
  };

  const createEddsaPublicKey = async (eddsaPrivateKey) => {
    const eddsa = await circomlib.buildEddsa();
    const privateKeyBytes = Buffer.from(eddsaPrivateKey, 'hex');
    const publicKeyPoints = eddsa.prv2pub(privateKeyBytes);
    const eddsaPublicKey = [
      Buffer.from(publicKeyPoints[0]).toString('hex'),
      Buffer.from(publicKeyPoints[1]).toString('hex'),
    ].toString();

    return eddsaPublicKey;
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
