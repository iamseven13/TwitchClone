import React, { useEffect, useContext, useState } from 'react';

import { Link, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';

import StateContext from '../StateContext';
import Axios from 'axios';

import DispatchContext from '../DispatchContext';

function SideBar() {
	let { username } = useParams();
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const [isLoading, setIsLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [recommendedUsers, setRecommendedUsers] = useState([]);
	const [followingUsers, setFollowingUsers] = useState([]);
	const [isRecommendedLoading, setIsRecommendedLoading] = useState(true);

	const config = {
		headers: {
			'x-auth-token': appState.user.token,
			'Content-Type': 'application/json',
		},
	};

	const setRequestFollowingUpdate = appState.setRequestFollowingUpdate;

	useEffect(() => {
		async function fetchFollowingUsers() {
			try {
				const res = await Axios.get(
					`http://localhost:2000/api/${appState.user.username}/following`,
					config
				);

				if (res.data) {
					const dataArray = res.data;

					setFollowingUsers(dataArray);
					setIsLoading(false);
				}
			} catch (e) {
				console.log('there was a problem');
			}
		}
		fetchFollowingUsers();
	}, [setRequestFollowingUpdate]);

	useEffect(() => {
		async function fetchRecommendedUsers() {
			try {
				const res = await Axios.get(
					'http://localhost:2000/api/users/recommendedUsers',

					config
				);
				const arrayData = Object.values(res.data);

				if (arrayData[0].username) {
					setRecommendedUsers(arrayData);
					setIsRecommendedLoading(false);
				} else {
					console.log('data is loading');
				}
			} catch (e) {
				console.log(e.message);
			}
		}

		fetchRecommendedUsers();
	}, [setRequestFollowingUpdate, appState.profileUser.user.username]);

	useEffect(() => {
		async function fetchUsers() {
			try {
				const res = await Axios.get(
					'http://localhost:2000/api/users/getAll',

					config
				);

				if (!res.data.msg) {
					setUsers(res.data);
					setIsLoading(false);
				}
			} catch (e) {
				console.log(e.message);
			}
		}

		fetchUsers();
	}, []);

	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<nav className="sidebar">
				<h2 className="followed-channel">
					{followingUsers.length ? 'Followed Channels' : 'Recommended'}
					<svg className="user-nav__icon followed-arrow">
						<IcomoonReact iconSet={iconSet} icon="arrow-left" />
					</svg>
				</h2>

				{appState.loggedIn && followingUsers.length ? (
					<>
						{followingUsers.map((user, index) => (
							<ul key={index} className="side-nav ">
								<li className="side-nav__item ">
									<Link
										to={`/${user.username}`}
										className="side-nav__link streamer-offline"
									>
										<img
											src={user.avatar}
											className="avatar-photo"
											alt="avatar-photo"
										/>
										<section className="streamer-info">
											<h3>{user.username}</h3>
											<span>5 new videos</span>
										</section>
										<section className="streamer-stats">
											<span className="viewers-amount">
												{user.isLive ? (
													<span className="online-following">Online</span>
												) : (
													'Offline'
												)}
											</span>
										</section>
									</Link>
								</li>
							</ul>
						))}
						<h2 className="followed-channel">
							Recommended
							<svg className="user-nav__icon followed-arrow">
								<IcomoonReact iconSet={iconSet} icon="arrow-left" />
							</svg>
						</h2>
						{!isRecommendedLoading
							? recommendedUsers.map((user, index) => (
									<ul key={index} className="side-nav ">
										<li className="side-nav__item ">
											<Link
												to={`/${user.username}`}
												className="side-nav__link streamer-offline"
											>
												<img
													src={user.avatar}
													className="avatar-photo"
													alt="avatar-photo"
												/>
												<section className="streamer-info">
													<h3>{user.username}</h3>
													<span>5 new videos</span>
												</section>
												<section className="streamer-stats">
													<span className="viewers-amount">
														{user.isLive ? (
															<span className="online-following">Online</span>
														) : (
															'Offline'
														)}
													</span>
												</section>
											</Link>
										</li>
									</ul>
							  ))
							: 'Loading'}
					</>
				) : (
					users.map((user, index) => (
						<ul key={index} className="side-nav ">
							<li className="side-nav__item ">
								<Link
									to={`/${user.username}`}
									className="side-nav__link streamer-offline"
								>
									<img
										src={user.avatar}
										className="avatar-photo"
										alt="avatar-photo"
									/>
									<section className="streamer-info">
										<h3>{user.username}</h3>
										<span>5 new videos</span>
									</section>
									<section className="streamer-stats">
										<span className="viewers-amount">
											{user.isLive ? (
												<span className="online-following">Online</span>
											) : (
												'Offline'
											)}
										</span>
									</section>
								</Link>
							</li>
						</ul>
					))
				)}
			</nav>
		</>
	);
}

export default SideBar;
