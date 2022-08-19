import React, { useEffect, useState, useContext } from 'react';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import { useParams } from 'react-router-dom';

import Axios from 'axios';

import ProfileOnline from './ProfileOnline';
import ProfileOffline from './ProfileOffline';

function Profile() {
	let { username } = useParams();

	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	const [isFollowing, setIsFollowing] = useState(false);

	const [streamerProfile, setStreamerProfile] = useState({
		user: {
			avatar:
				'http://www.gravatar.com/avatar/c76fa83b32c04a59d6e063918badbf53?s=200&r=pg&d=mm',
			date: '',
			email: '',
			isLive: true,
			isVerified: false,
			streamKey: '',
			username: '',
			_id: '',
		},
	});

	const config = {
		headers: {
			'Content-Type': 'application/json',
			'x-auth-token': appState.user.token,
		},
	};

	useEffect(() => {
		async function fetchProfileData() {
			try {
				const res = await Axios.get(`http://localhost:2000/api/${username}`);

				if (res.data.user) {
					setStreamerProfile(res.data);
					appDispatch({ type: 'profileUser', data: res.data });
					// appDispatch({ type: 'userGoLive' });
				} else {
				}
			} catch (e) {
				console.log(e.message);
			}
		}

		fetchProfileData();
	}, [username]);

	const loggedIn = appState.loggedIn;

	useEffect(() => {
		async function fetchProfileIsFollowing() {
			try {
				const res = await Axios.get(
					`http://localhost:2000/api/${username}/isFollowing`,

					config
				);

				if (!res.data.msg) {
					setIsFollowing(res.data);
				}
			} catch (e) {
				console.log(e.message);
			}
		}
		fetchProfileIsFollowing();
	}, [username, loggedIn]);

	return (
		<div className="profile-screen-online">
			{appState.profileUser.user.isLive ? (
				<ProfileOnline
					streamerProfile={streamerProfile}
					isFollowing={isFollowing}
					setIsFollowing={setIsFollowing}
				/>
			) : (
				<ProfileOffline
					streamerProfile={streamerProfile}
					isFollowing={isFollowing}
					setIsFollowing={setIsFollowing}
				/>
			)}
		</div>
	);
}

export default Profile;
