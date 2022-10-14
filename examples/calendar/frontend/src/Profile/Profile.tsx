import "./Profile.css";

import jwtDecode from "jwt-decode";
import React, { useState, useEffect, startTransition } from "react";

import { Auth, User } from "../types";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {ToggleButton, Button} from 'react-bootstrap';

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

	const getTimeAvailAPI = async (userId: string) => {
		const fetchAvailTimes = (await axios.get(`${process.env.REACT_APP_BACKEND_URL}/time/${userId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})).data;
		console.log("fetch", fetchAvailTimes);
		return fetchAvailTimes;
	}
	const createAppointmentAPI = async () => {
		const createAppointment = (await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointments`, {} ,{
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})).data;
		return createAppointment;
	}
	const setTimeAvailAPI = async (availableTimes: SetBooking) => {
		const setAvailTimes = (await axios.post(`${process.env.REACT_APP_BACKEND_URL}/time`, {availableTimes} ,{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
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
	
	const createAppointment = async () => {
		let timeStarts:number[] = [];
		let timeEnds:number[] = [];
		checkedTimes.forEach((time: string) => {
			timeStarts.push(parseInt(time));
			let endTime = parseInt(time) + 15 * 60 * 1000;
			timeEnds.push(endTime);
		});
		const booking: SetBooking = {
			"timeStarts": timeStarts,
			"timeEnds": timeEnds,
			"status": "available",
			"userId": userV.user?.id || 0,
		}
		console.log("booking", booking);
		await setTimeAvailAPI(booking);
		const data = await createAppointmentAPI();
		const secret_c = (data as any).appointment.secret;
		setVisibleLink(true);
		setLink(`${process.env.REACT_APP_FRONTEND_URL}/appointment/${secret_c}`)

	}
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [visibleLink, setVisibleLink] = useState<Boolean>(false);
	const [times, setTimes] = useState<Time[]>(timesInitial())
	const [userV, setUser] = useState<State>({
		loading: false,
		user: undefined,
		username: ""
	});
	const [checkedTimes, setCheckedTimes] = useState<string[]>([]);
	const [link, setLink] = useState<string>("text");
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
				const tempTimes = [...times];
				var foundIndex = tempTimes.findIndex(x => parseInt((x.startTime.getTime()/1000).toString()) == (booked.timeStart/1000));
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
			{visibleLink ? (
				<>
					<h1> Share Link with Appointment </h1>
					<pre><code>{link}</code></pre>

				</>) : (<>
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
										const tempTimes = [...checkedTimes];
										tempTimes[index] = time.startTime.getTime().toString();
										setCheckedTimes(tempTimes);
									}
								}>
       					{time.startTime.getHours()}:{time.startTime.getMinutes()}
      					</ToggleButton>)
					})}
						</>
			</div>
				</div>
				<Button variant="primary" size="lg" onClick={createAppointment}>Create Appointment</Button>
				<br/><br/><br/>
			</>)
			}
			
			<Button variant="secondary" onClick={onLoggedOut}>Logout</Button>
			
		</div>
	);
};
