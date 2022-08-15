import React, { useEffect, useState, useContext } from 'react';

import io from 'socket.io-client';
import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';

import StateContext from '../StateContext';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Axios from 'axios';

import game1 from '../img/slide1.jpg';
import game2 from '../img/slide2.jpg';
import game3 from '../img/slide3.jpg';
import game4 from '../img/slide4.jpg';
import game5 from '../img/slide5.jpg';
import DispatchContext from '../DispatchContext';

function ProfileOffline({ streamerProfile, isFollowing, setIsFollowing }) {
	const socket = io.connect('http://localhost:2000');
	let { username } = useParams();

	const appState = useContext(StateContext);

	const appDispatch = useContext(DispatchContext);

	function handleSubPayment(e) {
		Axios.post('http://localhost:2000/api/payment');
	}

	const config = {
		headers: {
			'x-auth-token': appState.user.token,
		},
	};

	console.log(username);

	useEffect(() => {
		console.log(appState.setRequestFollowingUpdate);
		// if (appState.setRequestFollowingUpdate) {
		// 	appDispatch({ type: 'UnsetRequestFollowingUpdate' });
		// }
	}, [appState.profileUser.user.username]);

	async function handleFollow(e) {
		e.preventDefault();
		try {
			const res = await Axios.post(
				`http://localhost:2000/api/addFollow/${streamerProfile.user.username}`,
				{},

				config
			);

			console.log(res.data);
			setIsFollowing(true);
			if (!appState.setRequestFollowingUpdate) {
				appDispatch({ type: 'setRequestFollowingUpdate' });
			} else {
				appDispatch({ type: 'UnsetRequestFollowingUpdate' });
			}

			console.log(appState.setRequestFollowingUpdate);
		} catch (e) {
			console.log(e.message);
		}
	}

	// this is something new

	async function handleUnFollow(e) {
		console.log(appState.setRequestFollowingUpdate);
		e.preventDefault();
		try {
			const res = await Axios.post(
				`http://localhost:2000/api/removeFollow/${streamerProfile.user.username}`,
				{},

				config
			);

			console.log(res.data);
			setIsFollowing(false);
			console.log(isFollowing);
			if (!appState.setRequestFollowingUpdate) {
				appDispatch({ type: 'setRequestFollowingUpdate' });
			} else {
				appDispatch({ type: 'UnsetRequestFollowingUpdate' });
			}
		} catch (e) {
			console.log(e.message);
		}
	}

	return (
		<>
			<div className="offline-profile">
				<div className="offline-profile-top">
					<section className="offline-profile-top__info">
						<section className="offline-profile-top__info--both">
							<span className="offline-profile-top__info--offline">
								offline
							</span>
							<span className="offline-profile-top__info--checkout">
								Check out this Fornite stream from yesterday.
							</span>
						</section>
						<a href="#" className="offline-profile-top__info--notifications">
							<svg className="right-desc__icons-top-svg">
								<IcomoonReact iconSet={iconSet} icon="bell" color="#8a4ee4" />
							</svg>
							<span className="offline-profile-top__info--notifications--turnon">
								Turn on Notifications
							</span>
						</a>
					</section>
					<section className="offline-profile-top__videos">
						<iframe
							width="560"
							height="315"
							src="https://www.youtube.com/embed/sr8MwKoARAc?controls=0"
							title="YouTube video player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					</section>
				</div>
				<div className="streamer-desc-profile">
					<section className="left-desc">
						<section className="left-desc__streamerAvatar">
							<img
								src={streamerProfile.user.avatar}
								className="streamer-desc-profile__avatar--offline"
								alt="streamer-pic"
							/>
						</section>

						<section className="left-desc__streamerInfo">
							<h2>{streamerProfile.user.username}</h2>
						</section>
					</section>
					<section className="right-desc">
						<section className="right-desc__icons-top">
							{appState.user.username === appState.profileUser.user.username ? (
								<Link to="/settings" className="offline-follow-btn">
									<svg className="right-desc__icons-top-svg">
										<IcomoonReact
											iconSet={iconSet}
											icon="profile"
											color="white"
										/>
									</svg>
									Edit Profile{' '}
								</Link>
							) : isFollowing ? (
								<>
									<Link to="/" onClick={handleUnFollow}>
										<svg className="right-desc__icons-top-svg">
											<IcomoonReact
												iconSet={iconSet}
												icon="heart"
												color="white"
											/>
										</svg>
									</Link>
									<a>
										<svg className="right-desc__icons-top-svg">
											<IcomoonReact
												iconSet={iconSet}
												icon="bell"
												color="white"
											/>
										</svg>
									</a>
								</>
							) : (
								<Link
									onClick={handleFollow}
									to="/"
									className="offline-follow-btn"
								>
									<svg className="right-desc__icons-top-svg">
										<IcomoonReact
											iconSet={iconSet}
											icon="heart"
											color="white"
										/>
									</svg>
									Follow{' '}
								</Link>
							)}
							<form
								action="http://localhost:2000/api/payment"
								className="subscribe-form"
								method="POST"
							>
								<button
									type="submit"
									className="right-desc__icons-top-subscribe"
								>
									<svg className="right-desc__icons-top-svg">
										<IcomoonReact
											iconSet={iconSet}
											icon="star-empty"
											color="white"
										/>
									</svg>
									<h4>Subscribe</h4>
									<svg className="right-desc__icons-top-svg">
										<IcomoonReact
											iconSet={iconSet}
											icon="arrow-down2"
											color="white"
										/>
									</svg>
								</button>
							</form>
						</section>
					</section>
				</div>
				<section className="streamer-desc">
					<section className="streamer-desc-left">
						<h2>About {streamerProfile.user.username}</h2>
						<span>
							2.3M{' '}
							<span className="streamer-desc-left__followers">followers</span>
						</span>
					</section>
					<section className="streamer-desc-right">
						<section className="streamer-desc-right__social1">
							<a>
								<svg className="right-desc__icons-top-svg">
									<IcomoonReact
										iconSet={iconSet}
										icon="instagram"
										color="white"
									/>
								</svg>
								<span>Instagram</span>
							</a>
						</section>
						<section className="streamer-desc-right__social1">
							<a>
								<svg className="right-desc__icons-top-svg">
									<IcomoonReact
										iconSet={iconSet}
										icon="twitter"
										color="white"
									/>
								</svg>
								<span>Twitter</span>
							</a>
						</section>
						<section className="streamer-desc-right__social1">
							<a>
								<svg className="right-desc__icons-top-svg">
									<IcomoonReact iconSet={iconSet} icon="tiktok" color="white" />
								</svg>
								<span>TikTok</span>
							</a>
						</section>
						<section className="streamer-desc-right__social1">
							<a>
								<svg className="right-desc__icons-top-svg">
									<IcomoonReact
										iconSet={iconSet}
										icon="youtube"
										color="white"
									/>
								</svg>
								<span>Youtube</span>
							</a>
						</section>
					</section>
				</section>
				<section className="second-section">
					<h2 className="second-section__h2">Recent Broadcasts</h2>
					<div className="recommended-channels">
						<div className="first-streamer">
							<img
								src={game2}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img
									src={streamerProfile.user.avatar}
									className="recommended-desc__avatar"
								/>
								<section className="recommended-desc__streamer-info">
									<h4>Dominating in Warzone!!</h4>
									<section className="name-game">
										<span>{streamerProfile.user.username}</span>
										<span>Call of Duty: Warzone</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game4}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img
									src={streamerProfile.user.avatar}
									className="recommended-desc__avatar"
								/>
								<section className="recommended-desc__streamer-info">
									<h4>escaping the cornfields of iowa</h4>
									<section className="name-game">
										<span>{streamerProfile.user.username}</span>
										<span>Apex Legends</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game5}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img
									src={streamerProfile.user.avatar}
									className="recommended-desc__avatar"
								/>
								<section className="recommended-desc__streamer-info">
									<h4>Trooper Snow | NoPixel |</h4>
									<section className="name-game">
										<span>{streamerProfile.user.username}</span>
										<span>GTA</span>
									</section>
								</section>
							</section>
						</div>

						<div className="first-streamer">
							<img
								src={game3}
								className="first-streamer__gameplay"
								alt="streamer pic"
							/>
							<section className="recommended-desc">
								<img
									src={streamerProfile.user.avatar}
									className="recommended-desc__avatar"
								/>
								<section className="recommended-desc__streamer-info">
									<h4>$2mil Duo Fortnite Tournament</h4>
									<section className="name-game">
										<span className="name-game__span1">
											{streamerProfile.user.username}
										</span>
										<span className="name-game__span2">Fortnite</span>
									</section>
								</section>
							</section>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}

export default ProfileOffline;
