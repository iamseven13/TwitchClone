import React, { useEffect, useState, useContext } from 'react';
import IcomoonReact, { iconList } from 'icomoon-react';
import iconSet from '../selection.json';
import Axios from 'axios';
import StateContext from '../StateContext';
import { Navigate } from 'react-router-dom';

function EditProfile() {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const appState = useContext(StateContext);

	const config = {
		headers: {
			'x-auth-token': appState.user.token,
			'Content-Type': 'application/json',
		},
	};

	async function handleUpdatePassword(e) {
		e.preventDefault();
		if (newPassword === confirmNewPassword) {
			try {
				const res = await Axios.put(
					`http://localhost:2000/api/${appState.user.username}/updatePassword`,
					{ oldPassword, newPassword, confirmNewPassword },
					config
				);
				console.log(res.data);
				setOldPassword('');
				setNewPassword('');
				setConfirmNewPassword('');
			} catch (e) {
				console.log(e.message);
			}
		} else {
			console.log('Error: Both new passwords must be the same!');
		}
	}
	if (!appState.loggedIn) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="edit-profile-container">
			<section className="edit-profile">
				<form onSubmit={handleUpdatePassword}>
					<section className="edit-profile-form__items">
						<span>Old Password</span>
						<input
							type="password"
							onChange={(e) => setOldPassword(e.target.value)}
							value={oldPassword}
							placeholder="Your old password"
						></input>
						<span>New Password</span>
						<input
							type="password"
							value={newPassword}
							placeholder="Your new password"
							onChange={(e) => setNewPassword(e.target.value)}
						></input>
						<span>Confirm New Password</span>
						<input
							value={confirmNewPassword}
							type="password"
							onChange={(e) => setConfirmNewPassword(e.target.value)}
							placeholder="Confirm your new password"
						></input>
						<section className="edit-profile-form__items--buttons">
							<nav className="right-desc__icons-top edit-profile-btn">
								<button
									type="submit"
									className="offline-follow-btn edit-profile-buttontype"
								>
									<svg className="right-desc__icons-top-svg">
										<IcomoonReact
											iconSet={iconSet}
											icon="redo2"
											color="white"
										/>
									</svg>
									Submit{' '}
								</button>
								<button
									type="submit"
									className="offline-follow-btn edit-profile-buttontype"
								>
									<svg className="right-desc__icons-top-svg">
										<IcomoonReact iconSet={iconSet} icon="exit" color="white" />
									</svg>
									Cancel{' '}
								</button>
							</nav>
						</section>
					</section>
				</form>
			</section>
		</div>
	);
}

export default EditProfile;
