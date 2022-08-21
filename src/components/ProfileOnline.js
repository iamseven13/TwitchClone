import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import StateContext from '../StateContext';
import VideoJS from './VideoJS';
import IcomoonReact, { iconList } from 'icomoon-react';
import iconSet from '../selection.json';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import Chat from './Chat';

import ReactPlayer from 'react-player';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';

function ProfileOnline({
	streamerProfile,
	isFollowing,
	setIsFollowing,
	isSubbed,
	setIsSubbed,
}) {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [fetchingDone, setIsFetchingDone] = useState(false);
	const [query, setQuery] = useState(
		new URLSearchParams(window.location.search)
	);

	const config = {
		headers: {
			'x-auth-token': appState.user.token,
		},
	};
	let { username } = useParams();

	const VIDEOJS_OPTIONS = {
		autoplay: 'play',
		controls: true,
		preload: 'auto',
		muted: true,
		sources: [
			{
				src: `http://164.92.134.131:8080/hls/${appState.profileUser.user.streamKey}.m3u8`,
				type: 'application/x-mpegURL',
			},
		],
		html5: {
			nativeAudioTracks: false,
			nativeVideoTracks: false,
		},
	};

	useEffect(() => {
		// Check to see if this is a redirect back from Checkout
		const query = new URLSearchParams(window.location.search);
		console.log(query.get('success'));

		if (query.get('success')) {
			console.log('Order placed! You will receive an email confirmation.');

			try {
				async function postSubscription() {
					const res = await Axios.post(
						'http://localhost:2000/api/ylli/subscribe',
						{ streamer: username },
						config
					);
					console.log(res.data);

					setIsSubbed(true);
					setIsFetchingDone(true);
				}
				postSubscription();
			} catch (e) {
				console.log(e.message);
			}
		}

		if (query.get('canceled')) {
			alert(
				"Order canceled -- continue to shop around and checkout when you're ready."
			);
		}
	}, [query]);

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
		} catch (e) {
			console.log(e.message);
		}
	}

	async function handleUnFollow(e) {
		e.preventDefault();
		try {
			const res = await Axios.post(
				`http://localhost:2000/api/removeFollow/${streamerProfile.user.username}`,
				{},

				config
			);

			console.log(res.data);
			setIsFollowing(false);
			if (!appState.setRequestFollowingUpdate) {
				appDispatch({ type: 'setRequestFollowingUpdate' });
			} else {
				appDispatch({ type: 'UnsetRequestFollowingUpdate' });
			}
		} catch (e) {
			console.log(e.message);
		}
	}

	let videoUrl = `http://164.92.134.131:8080/hls/${appState.profileUser.user.streamKey}.m3u8`;

	const handleSubscribeForm = (e) => {
		e.preventDefault();
		appDispatch({ type: 'openIsCheckoutForm' });
	};

	const handleUnSubscribeForm = (e) => {
		e.preventDefault();

		try {
			async function UnSubscription() {
				const res = await Axios.post(
					'http://localhost:2000/api/:username/Unsubscribe',
					{ streamer: username },
					config
				);
				console.log(res.data);

				setIsSubbed(false);
				setIsFetchingDone(false);
			}
			UnSubscription();
		} catch (e) {
			console.log(e.message);
		}
	};

	return (
		<>
			<div className="video-side">
				<VideoJS
					options={VIDEOJS_OPTIONS}
					data-setup='{"fluid": true}'
					style="width: 100%; height: 100%"
				/>
				<div className="streamer-desc-profile">
					<section className="left-desc">
						<section className="left-desc__streamerAvatar">
							<img
								src={streamerProfile.user.avatar}
								className="streamer-desc-profile__avatar"
								alt="streamer-pic"
							/>

							<section className="left-desc__streamerAvatar__live">
								<span>live</span>
							</section>
						</section>

						<section className="left-desc__streamerInfo">
							<h2>{streamerProfile.user.username}</h2>
							<span>{streamerProfile.user.streamTitle}</span>
							<a href="#" className="left-desc__streamerInfo__game">
								{streamerProfile.user.streamGame}
							</a>
						</section>
					</section>
					<section className="right-desc">
						<section className="right-desc__icons-top">
							{appState.user.username === appState.profileUser.user.username &&
							appState.loggedIn ? (
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

							<form className="subscribe-form">
								{!appState.profileUser.user.subscribers.includes(
									appState.user.username
								) ||
								!isSubbed ||
								!appState.loggedIn ? (
									<a
										onClick={handleSubscribeForm}
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
									</a>
								) : (
									<a
										onClick={handleUnSubscribeForm}
										className="right-desc__icons-top-subscribe unsub-button"
									>
										<svg className="right-desc__icons-top-svg">
											<IcomoonReact
												iconSet={iconSet}
												icon="star-empty"
												color="white"
											/>
										</svg>
										<h4>Unsubscribe</h4>
										<svg className="right-desc__icons-top-svg">
											<IcomoonReact
												iconSet={iconSet}
												icon="arrow-down2"
												color="white"
											/>
										</svg>
									</a>
								)}
							</form>
						</section>

						<section className="stats-viewers">
							<section className="stats-viewers__first">
								<svg className="right-desc__icons-top-svg">
									<IcomoonReact
										iconSet={iconSet}
										icon="users"
										color="rgb(235, 92, 92)"
									/>
								</svg>
								<span>{connectedUsers.length}</span>
							</section>
							<section className="stats-viewers__second">
								<svg className="right-desc__icons-top-svg">
									<IcomoonReact
										iconSet={iconSet}
										icon="folder-download"
										color="white"
									/>
								</svg>
							</section>
							<section className="stats-viewers__third">
								<svg className="right-desc__icons-top-svg">
									<IcomoonReact iconSet={iconSet} icon="list2" color="white" />
								</svg>
							</section>
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
						<span>
							{streamerProfile.user.username} streams all type of games.
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

				<section className="streamer-grid-section">
					<section className="streamer-grid-section-1 edit-all-grid">
						<section className="streamer-grid-section-1__item1 edit-all-grid-sections">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-baf01dbd-eba6-43a2-aeab-bf9140bf1adb"
								alt="item 1"
							/>
						</section>

						<section className="streamer-grid-section-1__item2  edit-all-grid-sections">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-6567587d-d374-4243-8aa8-091c75bf2576"
								alt=""
							/>
						</section>

						<section className="streamer-grid-section-1__item3  edit-all-grid-sections">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-e84772c3-32d1-4cbe-86c3-1c057bfd5f5a"
								alt=""
							/>
						</section>

						<section className="streamer-grid-section-1__item4  edit-all-grid-sections">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-3ecbedf2-1aaf-469d-b361-9bacbc273659"
								alt=""
							/>
						</section>
					</section>
					<section className="streamer-grid-section-2 edit-all-grid">
						<section className="streamer-grid-section-2__item1  edit-all-grid-sections">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-c6443f9b-776f-40a8-8c44-6f90690354fe"
								alt=""
							/>
						</section>
						<section className="streamer-grid-section-2__item2  edit-all-grid-sections">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-563a9671-071d-4743-bab2-b5a97f3906db"
								alt=""
							/>
						</section>
						<section className="streamer-grid-section-2__item3  edit-all-grid-sections">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-4c7c0af9-363b-48be-b653-e03225d8efa4"
								alt=""
							/>
							<span>
								Purchasing items on this list will give me a commision at no
								extra cost to you.
							</span>
						</section>
					</section>
					<section className="streamer-grid-section-3 edit-all-grid">
						<section className="streamer-grid-section-3__item1  edit-all-grid-sections">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-711c1207-ebd2-4323-82b2-d3fcf5910edb"
								alt=""
							/>
							<span>
								$2 or 200 bits for TTS. By donating you agree that the money you
								are using is yours and that you do not expect anything in
								return. No refunds.
							</span>
						</section>
						<section className="streamer-grid-section-3__item2">
							<img
								src="https://panels.twitch.tv/panel-53811294-image-a9e9c56f-f5c9-4ee3-a425-5c1be8acc8d5"
								alt=""
							/>
							<span>Same rules apply. No refunds</span>
						</section>
					</section>
				</section>
			</div>
			<Chat />
		</>
	);
}

export default ProfileOnline;
