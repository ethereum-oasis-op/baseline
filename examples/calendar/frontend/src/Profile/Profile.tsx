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
	startTime: Date;
	checked: boolean;
	disabled: boolean;
}
interface SetBooking {
	timeStarts: number[];
	timeEnds: number[];
	status: string;
	userId: number;
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
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const getTimeAvailAPI = async (userId: string) => {
		const fetchAvailTimes = (await axios.get(`${process.env.REACT_APP_BACKEND_URL}/time/${userId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})).data;
		console.log("fetch", fetchAvailTimes);
		return fetchAvailTimes;
	}
	const setTimeAvailAPI = async (availableTimes:SetBooking ) => {
		const setAvailTimes = (await axios.post(`${process.env.REACT_APP_BACKEND_URL}/time`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}, json: availableTimes
		})).data;
		return setAvailTimes;
	}
	const timesInitial = () => {
		const timeReturn = [];
		var someDate = new Date(selectedDate);
		someDate.setHours(8, 0, 0);
		for (var i = 0; i < 60; i++)
		{
			const newTime = someDate.getTime() + i * 15 * 60 * 1000;
			timeReturn.push({ startTime: new Date(newTime), checked: false, disabled: false });	
		}
		return timeReturn;
	}
	const setTimesFalse = () => {
		const timeReturn = [];
		var someDate = new Date(selectedDate);
		someDate.setHours(8, 0, 0);
		for (var i = 0; i < 60; i++)
		{
			const newTime = someDate.getTime() + i * 15 * 60 * 1000;
			timeReturn.push({ startTime: new Date(newTime), checked: false, disabled: false });	
		}
		return timeReturn;
	}

	const [times, setTimes] = useState<Time[]>(timesInitial())
	const [userV, setUser] = useState<State>({
		loading: false,
		user: undefined,
		username: ""
	});
	const [checkedTimes, setCheckedTimes] = useState<String[]>([]);
	useEffect(() => { 
		setTimes(timesInitial());
	}, [selectedDate]);

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
			setUser({ ...userV, user });
			const booked = await getTimeAvailAPI(id);
			booked.forEach((booking: any) => {
				let item = { startTime: booking.startTime, checked: false, disabled: false };
				const tempTimes = times;
				var foundIndex = tempTimes.findIndex(x => x === item);
				tempTimes[foundIndex] = { startTime: booking.startTime, checked: false, disabled: true };
				setTimes(tempTimes);
			});
		};
		fetchUserAPI();
	}, []);

	const { accessToken } = auth;

	const {
		payload: { publicAddress }
	} = jwtDecode<JwtDecoded>(accessToken);

	const { loading, user } = userV;

	const username = user && user.username;

	return (
		<div className="Profile">
			<p>
				Logged in as {publicAddress}  
				
			</p> 				
			<h1>Set your availability</h1>

			<div style={{display: "grid", gridTemplateColumns: "3fr 9fr"}}>
				<Calendar value={selectedDate} onChange={setSelectedDate} />
				
				<div style={{ "textAlign": "left" }}>
					<>
					{times?.map((time: Time, index:number) => {
						return (
							<ToggleButton key={index} className="mb-2" disabled={time.disabled} id={`toggle-check-${index}`} type="checkbox"
								variant="outline-primary" checked={checkedTimes[index] === time.startTime.getTime().toString()} value={index} onChange={
									(e) => {
										console.log("Checked times", checkedTimes[index]);
										const tempTimes = [...checkedTimes];
										//alert(e.target.value);
										//const findIndex = tempTimes.findIndex(x => x.startTime.getTime().toString() == e.target.value);
										//alert(findIndex);
										tempTimes[index] = time.startTime.getTime().toString();
										console.log("temptimes", tempTimes);
										//alert(e.target.checked);
										//e.target.checked = false;
										setCheckedTimes(tempTimes);
									}
								}>
       					{time.startTime.getHours()}:{time.startTime.getMinutes()}
      					</ToggleButton>)
					})}
						</>
			</div>
			</div>
			<button onClick={onLoggedOut}>Logout</button>
			
		</div>
	);
};
