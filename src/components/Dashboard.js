import React, { useEffect, useState, useContext } from 'react';

import io from 'socket.io-client';
import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';
import hasanLogo from '../img/hasan.jpeg';
import StateContext from '../StateContext';
import { useParams, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Axios from 'axios';

import VideoDashboard from './VideoDashboard';
import DispatchContext from '../DispatchContext';

function Dashboard({ loggedIn }) {
	const socket = io.connect('http://localhost:2000');
	let { username } = useParams();

	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const videoJsOptions = {
		autoplay: false,
		controls: true,
		sources: [
			{
				src: 'http://164.92.134.131:8080/hls/video.m3u8',
				type: 'application/x-mpegURL',
			},
		],
	};
	const [message, setMessage] = useState('');
	const [messageReceived, setMessageReceived] = useState([]);
	const [roomName, setRoomName] = useState(username);
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [isSent, setIsSent] = useState(false);
	const [streamId, setStreamId] = useState(localStorage.getItem('streamId'));
	const [streamerDashboard, setStreamerDashboard] = useState({
		username: localStorage.getItem('dashboardUsername'),
		isLive: localStorage.getItem('dashboardIsLive'),
	});
	const [isUserReady, setIsUserReady] = useState(
		Boolean(localStorage.getItem('dashboardUsername'))
	);

	const loggedInUser = appState.user.username;
	const token = appState.user.token;
	console.log(appState.user);

	const config = {
		headers: {
			'x-auth-token': token,
		},
	};

	useEffect(() => {
		const getStreamId = localStorage.getItem('streamId');
		console.log(getStreamId);

		if (
			getStreamId === null ||
			getStreamId === 'undefined' ||
			getStreamId === ''
		) {
			const randomId = uuidv4();
			setStreamId(randomId);
			localStorage.setItem('streamId', randomId);
			async function sendStreamId() {
				try {
					const res = await Axios.post(
						'http://localhost:2000/api/create-key',
						{
							loggedInUser,
							randomId,
						},
						config
					);
					console.log(res.data);
				} catch (e) {
					console.log(e.message);
				}
			}
			sendStreamId();
		}
	}, []);

	// const joinRoom = () => {
	// 	if (roomName !== '') {
	// 		socket.emit('join_room', roomName);
	// 	}
	// };
	useEffect(() => {
		socket.emit('join_room', roomName);
	}, [roomName]);

	useEffect(() => {
		socket.on('connect', () => {
			let users = [];
			users = socket.id.split(',');
			console.log(socket);
			setConnectedUsers([users, ...connectedUsers]);
		});
	}, [roomName]);

	console.log(messageReceived);

	const sendMessage = (e) => {
		e.preventDefault();
		socket.emit('send_message', { message, roomName });
		setMessage('');
		setIsSent(true);
	};

	useEffect(() => {
		socket.on('receive_message', (data) => {
			setMessageReceived([...messageReceived, data.message]);
		});
		console.log(messageReceived);
	}, [socket]);

	async function handleStartStreaming(e) {
		e.preventDefault();
		const res = await Axios.put(
			'http://localhost:2000/api/userGoesLive',
			{},
			config
		);

		if (res.data.username) {
			setStreamerDashboard(res.data);
			setIsUserReady(true);
		}
	}
	console.log(streamerDashboard);

	async function handleStopStreaming(e) {
		e.preventDefault();
		const res = await Axios.put(
			'http://localhost:2000/api/userStopLive',
			{},
			config
		);

		if (res.data.username) {
			setStreamerDashboard(res.data);
			setIsUserReady(false);
		}
	}

	useEffect(() => {
		if (isUserReady) {
			localStorage.setItem('dashboardUsername', streamerDashboard.username);
			localStorage.setItem('dashboardIsLive', streamerDashboard.isLive);
		} else {
			localStorage.removeItem('dashboardUsername');
			localStorage.removeItem('dashboardIsLive');
		}
	}, [isUserReady]);

	if (!loggedIn) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="dashboard-container">
			<section className="dashboard1">
				<section className="dashboard1_part1">
					<section className="dashboard1_part1-items">
						<h3 className="activity-feed">Activity Feed</h3>
						<section className="dashboard1_part1--2">
							<span className="filter">Filter</span>
							<svg className="right-desc__icons-top-svg">
								<IcomoonReact iconSet={iconSet} icon="list2" color="white" />
							</svg>
						</section>
					</section>
					<section className="dashboard1_part1-items2">
						<h2>It's quiet. Too quiet...</h2>
						<span>
							We will show your new follows, subs, cheers, raids, and host
							activity here.
						</span>
					</section>
				</section>
				<section className="dashboard1_part2">Chat here</section>
			</section>
			<section className="dashboard2">
				<div className="stream-video">
					<div className="stream-video__start-streaming">
						<form className="stream-video-sections" action="submit">
							<section className="firstInput">
								<span>Stream Title</span>
								<input placeholder="Title"></input>
							</section>
							<section className="secondInput">
								<span>Game</span>
								<input className="input-game" placeholder="Game"></input>
							</section>
						</form>
						<section className="grabStreamId">
							<section className="grabStreamId-desc">
								<span className="stream-key-span">Stream Key: </span>
								<section className="grabStreamId-desc--item1">
									<span id="mystreamid">{streamId}</span>
								</section>
							</section>
							<section className="grabStreamId-btn">
								{!streamerDashboard.isLive ? (
									<a
										onClick={handleStartStreaming}
										className="save-settings"
										href="#"
									>
										Start Streaming
									</a>
								) : (
									<a
										onClick={handleStopStreaming}
										className="save-settings"
										href="#"
									>
										Stop Streaming
									</a>
								)}
							</section>
						</section>
					</div>
					<VideoDashboard appState={appState} />
				</div>
			</section>
			<section className="dashboard3">Section 3</section>
		</div>
	);
}

export default Dashboard;
