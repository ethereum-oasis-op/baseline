import "./Login.css";

import React, { useState } from "react";
import Web3 from "web3";
import axios from 'axios';

import { Auth, User } from "../types";

interface Props {
	onLoggedIn: (auth: Auth) => void;
}

let web3: Web3 | undefined = undefined; // Will hold the web3 instance

export const Login =  ({ onLoggedIn }: Props): JSX.Element => {
	const [loading, setLoading] = useState(false); // Loading button state

	const handleAuthenticate = async ({ publicAddress, signature }: { publicAddress: string; signature: string }) => {
		const res = await axios.post<Auth>(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
			 "publicAddress": publicAddress, 
			 "signature": signature });
		return res.data;
		}

	const handleSignMessage = async ({ publicAddressSigned, nonce }: { publicAddressSigned: string; nonce: string }) => {
		try {
			const signature = await web3!.eth.personal.sign(`I am signing my one-time nonce: ${nonce}`, publicAddressSigned, "");
			return { publicAddressSigned, signature };
		} catch (err) {
			throw new Error("You need to sign the message to be able to log in.");
		}
	};

	const handleSignup = async (publicAddress: string) =>{
		try {
			const resonse = await axios.post<User>(`${process.env.REACT_APP_BACKEND_URL}/users`, {
				"publicAddress":  publicAddress 
			});
			return resonse.data;
		}
		catch (err) {
			throw new Error("Unable to sign up on the website!");
		}
	}

	const handleClick = async () => {
		// Check if MetaMask is installed
		if (!(window as any).ethereum) {
			window.alert("Please install MetaMask first.");
			return;
		}

		if (!web3) {
			try {
				// Request account access if needed
				await (window as any).ethereum.enable();

				// We don't know window.web3 version, so we use our own instance of Web3
				// with the injected provider given by MetaMask
				web3 = new Web3((window as any).ethereum);
			} catch (error) {
				window.alert("You need to allow MetaMask.");
				return;
			}
		}

		const coinbase = await web3.eth.getCoinbase();
		if (!coinbase) {
			window.alert("Please activate MetaMask first.");
			return;
		}

		const publicAddress = coinbase.toLowerCase();
		setLoading(true);

		// Look if user with current publicAddress is already present on backend
		const users = (await axios.get<User[]>(`${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`)).data;
		if(users.length > 0){
			const {publicAddressSigned, signature} = await handleSignMessage({"publicAddressSigned": publicAddress, "nonce": users[0].nonce});
			const auth = await handleAuthenticate({"publicAddress": publicAddressSigned, "signature": signature});
			await onLoggedIn(auth)
			onLoggedIn(auth);
			setLoading(false);
		}
		else
		{
			const user = await handleSignup(publicAddress);
			const {publicAddressSigned, signature} = await handleSignMessage({"publicAddressSigned": publicAddress, "nonce": user.nonce});
			const auth = await handleAuthenticate({"publicAddress": publicAddressSigned, "signature": signature});
			await onLoggedIn(auth)
			onLoggedIn(auth);
			setLoading(false);
		}	
			
	};

	return (
		<div>
			<p>
				Login with metamask! If the address is not associated with an account, 
				it will create one. 
			</p>
			<button className="Login-button Login-mm" onClick={handleClick}>
				{loading ? "Loading..." : "Login with MetaMask"}
			</button>
			
		</div>
	);
};
