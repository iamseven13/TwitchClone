import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import iconSet from '../selection.json';
import IcomoonReact, { iconList } from 'icomoon-react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function Settings() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);

	function handleLogout(e) {
		e.preventDefault();

		appDispatch({ type: 'logout' });
		appDispatch({ type: 'closeSettingsPopUp' });
	}

	return (
		<div
			onClick={() => {
				appDispatch({ type: 'closeSettingsPopUp' });
			}}
			className="settings-popup-container"
		>
			<div className="settings-form">
				<svg
					onClick={(e) => {
						appDispatch({ type: 'closeSettingsPopUp' });
					}}
					className="user-nav__icon settings-circle"
				>
					<IcomoonReact iconSet={iconSet} icon="cancel-circle" />
				</svg>
				<section>
					<img
						src={appState.user.avatar}
						alt="user pic"
						className="user-nav__user-photo"
					/>
					<Link className="link-class" to={appState.user.username}>
						{appState.user.username}
					</Link>
				</section>
				<section>
					<svg className="user-nav__icon">
						<IcomoonReact iconSet={iconSet} icon="profile" />
					</svg>
					<Link className="link-class" to="/settings">
						Settings
					</Link>
				</section>
				<section>
					<svg className="user-nav__icon">
						<IcomoonReact iconSet={iconSet} icon="video-camera" />
					</svg>
					<Link to="/dashboard" className="link-class">
						Creator Dashboard
					</Link>
				</section>

				<section>
					<svg className="user-nav__icon">
						<IcomoonReact iconSet={iconSet} icon="exit" />
					</svg>
					<Link className="link-class" to="" onClick={handleLogout}>
						Log out
					</Link>
				</section>
			</div>
		</div>
	);
}

export default Settings;
