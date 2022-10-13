import "./App.css";

import React, { useEffect, useState } from "react";

import { Login } from "./Login";
import { Profile } from "./Profile";
import { Appointment } from "./Appointment";

import { Auth } from "./types";
import logo from "./logo.svg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const LS_KEY = "login-with-metamask:auth";

interface State {
	auth?: Auth;
}

const App = (): JSX.Element => {
	const [state, setState] = useState<State>({});

	useEffect(() => {
		// Access token is stored in localstorage
		const ls = window.localStorage.getItem(LS_KEY);
		const auth = ls && JSON.parse(ls);
		setState({ auth });
	}, []);

	const handleLoggedIn = (auth: Auth) => {
		localStorage.setItem(LS_KEY, JSON.stringify(auth));
		setState({ auth });
	};

	const handleLoggedOut = () => {
		localStorage.removeItem(LS_KEY);
		setState({ auth: undefined });
	};

	const { auth } = state;

	return (
		<div className="App">
				<header className="App-header">
				<h1 className="App-title">Welcome to Baseline Calendar!</h1>
			</header>
			<Router>
				<Routes>
					<Route path="/appointment/:secret" element={auth ? <Appointment auth={auth} onLoggedOut={handleLoggedOut} /> :  <Login onLoggedIn={handleLoggedIn} />} />
					<Route path="/" element={<div className="App-intro">{auth ? <Profile auth={auth} onLoggedOut={handleLoggedOut} /> : <Login onLoggedIn={handleLoggedIn} />}</div>} />
				</Routes>
			</Router>
		
			
		</div>
	);
};
export default App;
