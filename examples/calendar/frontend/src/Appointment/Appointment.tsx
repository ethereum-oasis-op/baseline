import "./Appointment.css";

import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";

import { Auth, User } from "../types";
import axios from "axios";
import {ToggleButton, Button, ButtonGroup} from 'react-bootstrap';
import { useParams } from "react-router-dom";
import { create } from "domain";
interface Props {
	auth: Auth;
	onLoggedOut: () => void;
}
interface booking {
    display: string;
    value: string;
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

export const Appointment = ({ auth, onLoggedOut }: Props): JSX.Element => {

    const { secret } = useParams();
	const validateSecret = async (userV: any) => {
        const appointment = (await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointments/validate`, {
            secret: secret
        }, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
        })).data.appointment;
		setStatus(appointment.status);

		const slotDate = new Date(parseInt(appointment.slot));
		setSlot(slotDate.getHours().toString() + ":" + slotDate.getMinutes().toString());

        if (userV.id == appointment.fromUser) setIsCreator(true);
        else setIsCreator(false);
		return appointment;
	}
	const getTimesInitial = async () => {
        const createAppointment = (await axios.post(`${process.env.REACT_APP_BACKEND_URL}/time/fewTimes`, {
            secret: secret
        } ,{
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
        })).data;
        const timeslots:booking[] = [];
        createAppointment.forEach((timeslot:any) => {
            const date = new Date(timeslot.timeStart);
            timeslots.push({ display: date.getHours().toString() + ":" + date.getMinutes().toString(), value: date.getTime().toString() });
        });
        setTimes(timeslots);
        console.log("create appointment", createAppointment);
		return createAppointment;
	}
	const generateProof = async (address: string, slot: string) => {
        const proof = (await axios.post(`${process.env.REACT_APP_BACKEND_URL}/circuit/proof`,
            {
                secret: secret,
                publicAddress: address,
                slot: slot
            },
            {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
            })).data;
        console.log("proof", proof);
		return proof;
    }
    const validateProof = async ( address: string, slot: string) => {
        const validated = (await axios.post(`${process.env.REACT_APP_BACKEND_URL}/circuit/verify`,
            {
                secret: secret,
                publicAddress: address,
                slot: slot
            },
            {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
            })).data;
        console.log("validated", validated);
		return validated;
    }
	
	
	const scheduleAppointment = async () => {
        generateProof(publicAddress, selectedTime);
    }
    const confirmAppointment = async () => {
        const appointment = (await axios.post(`${process.env.REACT_APP_BACKEND_URL}/appointments/validate`, {
            secret: secret
        }, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
        })).data.appointment;
		const slot = appointment.slot;
		setSlot(slot);
        await validateProof(publicAddress, slot);
    }
	const [isCreator, setIsCreator] = useState<Boolean>(false);
	const [userV, setUser] = useState<State>({
		loading: false,
		user: undefined,
		username: ""
	});
    const [times, setTimes] = useState<booking[]>([]);
    const [status, setStatus] = useState<string>("Status Loading....");
    const [selectedTime, setSelectedTime] = useState<string>("");
	const [slot, setSlot] = useState<string>("");
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
            validateSecret(user);
			
		};
        fetchUserAPI();
        getTimesInitial();
        
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
			{isCreator ? (
				<>
					<h1> Share Link with Appointment </h1>
					<h3>Status: {status} </h3>
                    {status === "created" && <p>Awaiting the person you have sent this link to schedule an appointment with you. Once done you can confirm / verify the availability. </p>}
					{status === "pending" && <p>Other person as requested a slot at {slot}, confirm and verify the appointment </p>}
					{status === "confirmed" && <p>Appointment booked at {slot}! </p>}

					<Button onClick={confirmAppointment} disabled={status !== "pending"} variant="primary" size="lg">Confirm Appointment - Verify Proof</Button>

				</>) : (<>
			        <h1>Schedule Appointment!</h1>
                	<h3>Status: {status} </h3>
			
				{status === "created" && <div style={{ "textAlign": "center" }}>
					 <ButtonGroup className="mb-2">
					{times?.map((time: booking, index:number) => {
						return (
                            
							<ToggleButton key={index} name="radio"  id={`toggle-check-${index}`} type="radio"
                                variant="outline-primary" value={time.value} checked={time.value == selectedTime}
                                onChange={
									(e) => setSelectedTime(time.value)}>
                                {time.display}
      					</ToggleButton>
                           
                        )
                    })}
                        </ButtonGroup> <br/>
                        <Button  disabled={selectedTime === ""} variant="primary" size="lg" onClick={scheduleAppointment}>Request Appointment - Create Proof</Button>
						
			</div>}
				
				
				
				
			</>)
			}
			<br/><br/><br/>
			<Button variant="secondary" onClick={onLoggedOut}>Logout</Button>
			
		</div>
	);
};
