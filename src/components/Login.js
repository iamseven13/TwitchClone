import React, { useEffect, useState, useContext } from 'react';

import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import Axios from 'axios';

function Login() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	function handleExitForm(e) {
		e.preventDefault();

		appDispatch({ type: 'closeLoginForm' });
	}

	async function handleLogin(e) {
		e.preventDefault();

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await Axios.post(
				'http://localhost:2000/api/login',
				{
					username,
					password,
				},
				config
			);
			if (res.data.token) {
				appDispatch({ type: 'login', data: res.data });
				appDispatch({ type: 'closeLoginForm' });
				console.log(res.data);
			} else {
				console.log(res.data);
			}
		} catch (e) {
			console.log(e.message);
		}
	}

	return (
		<div className="reg-bigger-container">
			<div className="reg-container">
				<svg onClick={handleExitForm} className="user-nav__icon followed-arrow">
					<IcomoonReact iconSet={iconSet} icon="cancel-circle" />
				</svg>
				<form onSubmit={handleLogin} type="submit" className="reg-form">
					<span>Username</span>
					<input
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Please type your username"
					></input>

					<span>Password</span>
					<input
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						placeholder="Please type your password"
					></input>
					<a onClick={handleLogin} className="reg-button" href="#">
						Login
					</a>
					<button className="hidden-loggin" type="submit">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
