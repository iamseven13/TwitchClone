import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import IcomoonReact, { iconList } from 'icomoon-react';
import iconSet from '../selection.json';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';

function Chat() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	let { username } = useParams();

	const [messageReceived, setMessageReceived] = useState([]);
	const [roomName, setRoomName] = useState(username);
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [isSent, setIsSent] = useState(false);
	const [localMessages, setLocalMessages] = useState([]);
	const [chat, setChat] = useState({
		message: '',
		roomName: roomName,
		user: appState.user.username,
		avatar: appState.user.avatar,
	});

	const messagesEndRef = useRef(null);
	const socket = io.connect('http://localhost:2000');

	// const scrollToBottom = () => {
	// 	messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	// };

	// useEffect(() => {
	// 	scrollToBottom();
	// }, [messageReceived]);

	function handleChatInput(e) {
		e.preventDefault();

		setChat({
			...chat,
			[e.target.name]: e.target.value,
			user: appState.user.username,
			roomName: roomName,
			avatar: appState.user.avatar,
		});
		console.log(chat);
	}

	useEffect(() => {
		socket.emit('join_room', roomName);
	}, [roomName]);

	useEffect(() => {
		socket.on('connect', () => {
			let users = [];
			users = socket.id.split(',');

			setConnectedUsers([users, ...connectedUsers]);
		});
	}, [roomName]);

	const sendMessage = (e) => {
		e.preventDefault();

		const { message, roomName, user, avatar } = chat;

		socket.emit('send_message', {
			message,
			roomName,
			user,
			avatar,
		});

		setChat({ message: '', roomName: '', user: '', avatar: '' });
	};

	useEffect(() => {
		socket.on('receive_message', ({ message, roomName, user, avatar }) => {
			console.log(message, roomName, user, avatar);
			setMessageReceived((prev) => [
				...prev,
				{ message, user, roomName, avatar },
			]);
			return () => {
				socket.disconnect();
			};
			console.log(messageReceived);
		});
	}, []);

	console.log(chat.message);

	return (
		<div className="chat-side">
			<section className="chat-side-first-part">
				<div className="chat-side-first-part__item1">
					<svg className="right-desc__icons-top-svg">
						<IcomoonReact iconSet={iconSet} icon="arrow-right" color="white" />
					</svg>
				</div>
				<span className="chat-side-first-part__item2">STREAM CHAT</span>
				<div className="chat-side-first-part__item3">
					<svg className="right-desc__icons-top-svg">
						<IcomoonReact iconSet={iconSet} icon="users" color="white" />
					</svg>
				</div>
			</section>
			<section className="chat-side-second-part">
				<section className="chat-side-second-part__item1">
					<svg className="right-desc__icons-top-svg bits-big">
						<IcomoonReact iconSet={iconSet} icon="diamonds" color="gold" />
					</svg>
					<span className="bits-number-one">1</span>
					<section className="chat-side-second-part__item1__user">
						<span className="bits-name">jjsto9</span>
						<section>
							<svg className="right-desc__icons-top-svg bits">
								<IcomoonReact
									iconSet={iconSet}
									icon="diamonds"
									color="#9c3ee8"
								/>
							</svg>
							<span className="number-of-bits">510</span>
						</section>
					</section>
				</section>

				<div className="least-bits">
					<section className="chat-side-second-part__item1">
						<svg className="right-desc__icons-top-svg bits-big">
							<IcomoonReact iconSet={iconSet} icon="diamonds" color="aqua" />
						</svg>
						<span className="bits-number-one">2</span>
						<section className="chat-side-second-part__item1__user">
							<span className="bits-name">marol</span>
							<section>
								<svg className="right-desc__icons-top-svg bits">
									<IcomoonReact
										iconSet={iconSet}
										icon="diamonds"
										color="#9c3ee8"
									/>
								</svg>
								<span className="number-of-bits">320</span>
							</section>
						</section>
					</section>

					<section className="chat-side-second-part__item1">
						<svg className="right-desc__icons-top-svg bits-big">
							<IcomoonReact iconSet={iconSet} icon="diamonds" color="brown" />
						</svg>
						<span className="bits-number-one">3</span>
						<section className="chat-side-second-part__item1__user">
							<span className="bits-name">Jacob</span>
							<section>
								<svg className="right-desc__icons-top-svg bits">
									<IcomoonReact
										iconSet={iconSet}
										icon="diamonds"
										color="#9c3ee8"
									/>
								</svg>
								<span className="number-of-bits">290</span>
							</section>
						</section>
					</section>
				</div>
			</section>

			<section className="chat-renders-here">
				{messageReceived
					.map((user, index) => (
						<section
							ref={messagesEndRef}
							key={index}
							className="chat-side-third-part"
						>
							<div className="chat1-parent">
								<section className="chat1">
									<img
										src={user.avatar}
										alt="user pic"
										className="user-nav__user-photo"
									/>
								</section>
								<div>
									<span className="chat-username">
										{user.user}:{' '}
										<span className="chat-message">{user.message}</span>
									</span>
								</div>
							</div>
						</section>
					))
					.reverse()}
			</section>

			<section className="chat-input">
				{appState.user.username ? (
					<form type="submit" onSubmit={sendMessage}>
						<input
							name="message"
							value={chat.message}
							onChange={(e) => handleChatInput(e)}
							autoFocus
						></input>
						<Link to="" onClick={sendMessage} className="chat-button" href="#">
							Chat
						</Link>
					</form>
				) : (
					<form className="chat-disabled">
						<input className="not-loggedIn" disabled></input>
						<span className="text">
							You need to <a href="#">login</a>/<a href="#">register</a> to chat
						</span>
					</form>
				)}
			</section>
		</div>
	);
}

export default Chat;
