import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function Register() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	function handleExitForm(e) {
		e.preventDefault();

		appDispatch({ type: 'closeRegisterForm' });
	}

	async function submitRegisterData(e) {
		e.preventDefault();

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const res = await Axios.post(
				'http://localhost:2000/api/register',

				{
					username: username,
					password,
					email: email.toLowerCase(),
				},
				config
			);

			if (res.data.token) {
				appDispatch({ type: 'login', data: res.data });
				appDispatch({ type: 'closeRegisterForm' });
			}

			console.log(res.data);
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
				<form onSubmit={submitRegisterData} className="reg-form">
					<span>Username</span>
					<input
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Please type your username"
						value={username}
					></input>
					<span>Email</span>
					<input
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Please type your email"
						value={email}
					></input>
					<span>Password</span>
					<input
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						value={password}
						placeholder="Please type your password"
					></input>
					<Link
						to={''}
						onClick={submitRegisterData}
						className="reg-button"
						href="#"
					>
						Sign up
					</Link>
					<button className="hidden-loggin" type="submit">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}

export default Register;
