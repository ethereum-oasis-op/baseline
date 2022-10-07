import "./Profile.css";

import jwtDecode from "jwt-decode";
import React, { useState, useEffect, startTransition } from "react";

import { Auth, User } from "../types";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ToggleButton from 'react-bootstrap/ToggleButton';

interface Props {
	auth: Auth;
	onLoggedOut: () => void;
}

interface Time {
	startTime: number;
	checked: boolean;
}
interface State {
	loading: boolean;
	user?: {
		id: number;
		username: string;
	};
	username: string;
	times?: Time[]
}

interface JwtDecoded {
	payload: {
		id: string;
		publicAddress: string;
	};
}

export const Profile = ({ auth, onLoggedOut }: Props): JSX.Element => {
	
	const [state, setState] = useState<State>({
		loading: false,
		user: undefined,
		username: "",
		times: [{startTime: 1888, checked: false}],
	});

	useEffect(() => {
		const { accessToken } = auth;
		const {
			payload: { id }
		} = jwtDecode<JwtDecoded>(accessToken);

		async function fetchUserAPI() {
			const user = (await axios.get<User>(`${process.env.REACT_APP_BACKEND_URL}/users/user`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			})).data;
			setState({...state, user});
		};
		fetchUserAPI();

	}, []);

	const { accessToken } = auth;

	const {
		payload: { publicAddress }
	} = jwtDecode<JwtDecoded>(accessToken);

	const { loading, user, times } = state;

	const username = user && user.username;

	return (
		<div className="Profile">
			<p>
			Logged in as {publicAddress}  
			</p> 				
			
			<h1>Set your availability</h1>
			<div style={{display: "grid", gridTemplateColumns: "3fr 9fr"}}>
			<Calendar />
				<div style={{ "textAlign": "left" }}>
					{times?.map((time: Time) => {
						return (
						<ToggleButton className="mb-2" id="toggle-check" type="checkbox" variant="outline-primary" value="1">
       					{time.startTime}
      					</ToggleButton>)
					})}
			</div>
			</div>
			<button onClick={onLoggedOut}>Logout</button>
			
		</div>
	);
};
